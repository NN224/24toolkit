import dns from 'dns';
import { promisify } from 'util';

const dnsResolve4 = promisify(dns.resolve4);

export const config = {
  runtime: 'nodejs'
};

// DNS-based Blacklists (DNSBLs) - These are real, free blacklist services
const BLACKLISTS = [
  { name: 'Spamhaus ZEN', zone: 'zen.spamhaus.org', description: 'Combined Spamhaus blocklist' },
  { name: 'Spamhaus SBL', zone: 'sbl.spamhaus.org', description: 'Spamhaus Block List' },
  { name: 'Spamhaus XBL', zone: 'xbl.spamhaus.org', description: 'Exploits Block List' },
  { name: 'Barracuda', zone: 'b.barracudacentral.org', description: 'Barracuda Reputation Block List' },
  { name: 'SpamCop', zone: 'bl.spamcop.net', description: 'SpamCop Blocking List' },
  { name: 'SORBS', zone: 'dnsbl.sorbs.net', description: 'SORBS DNSBL' },
  { name: 'UCEPROTECT L1', zone: 'dnsbl-1.uceprotect.net', description: 'UCEPROTECT Level 1' },
  { name: 'Composite BL', zone: 'cbl.abuseat.org', description: 'Composite Blocking List' },
  { name: 'Truncate', zone: 'truncate.gbudb.net', description: 'Truncate DNSBL' },
  { name: 'PSBL', zone: 'psbl.surriel.com', description: 'Passive Spam Block List' },
  { name: 'Mailspike BL', zone: 'bl.mailspike.net', description: 'Mailspike Blacklist' },
  { name: 'JustSpam', zone: 'dnsbl.justspam.org', description: 'JustSpam DNSBL' }
];

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get IP from query or body
    let ip = req.query.ip || req.body?.ip;
    
    if (!ip) {
      return res.status(400).json({ error: 'IP address is required' });
    }

    ip = ip.trim();

    // Validate IPv4 format
    const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
    const match = ip.match(ipv4Regex);
    
    if (!match) {
      return res.status(400).json({ error: 'Invalid IPv4 address format' });
    }

    // Validate each octet is 0-255
    const octets = [match[1], match[2], match[3], match[4]].map(Number);
    if (octets.some(o => o < 0 || o > 255)) {
      return res.status(400).json({ error: 'Invalid IP address - octets must be 0-255' });
    }

    // Check if private IP
    const privateInfo = checkPrivateIP(octets);
    if (privateInfo.isPrivate) {
      return res.status(200).json({
        success: true,
        ip: ip,
        isPrivate: true,
        privateType: privateInfo.type,
        message: 'Private IP addresses cannot be checked against public blacklists',
        results: []
      });
    }

    // Reverse the IP for DNSBL query (1.2.3.4 becomes 4.3.2.1)
    const reversedIP = octets.reverse().join('.');

    // Check all blacklists in parallel
    const results = await Promise.all(
      BLACKLISTS.map(bl => checkBlacklist(reversedIP, bl))
    );

    // Count listings
    const listedCount = results.filter(r => r.listed).length;
    const cleanCount = results.filter(r => !r.listed && !r.error).length;
    const errorCount = results.filter(r => r.error).length;

    // Determine overall status
    let status = 'clean';
    let riskLevel = 'low';
    
    if (listedCount > 0) {
      status = 'listed';
      if (listedCount >= 5) {
        riskLevel = 'critical';
      } else if (listedCount >= 3) {
        riskLevel = 'high';
      } else if (listedCount >= 1) {
        riskLevel = 'medium';
      }
    }

    return res.status(200).json({
      success: true,
      ip: ip,
      isPrivate: false,
      status: status,
      riskLevel: riskLevel,
      summary: {
        total: BLACKLISTS.length,
        listed: listedCount,
        clean: cleanCount,
        errors: errorCount
      },
      results: results
    });

  } catch (error) {
    console.error('IP Check Error:', error);
    return res.status(500).json({ 
      error: 'Failed to check IP',
      message: error.message 
    });
  }
}

function checkPrivateIP(octets) {
  const [a, b, c, d] = octets.reverse(); // Reverse back to original order
  
  // 10.0.0.0 - 10.255.255.255 (Class A private)
  if (a === 10) {
    return { isPrivate: true, type: 'Class A Private (10.x.x.x)' };
  }
  
  // 172.16.0.0 - 172.31.255.255 (Class B private)
  if (a === 172 && b >= 16 && b <= 31) {
    return { isPrivate: true, type: 'Class B Private (172.16-31.x.x)' };
  }
  
  // 192.168.0.0 - 192.168.255.255 (Class C private)
  if (a === 192 && b === 168) {
    return { isPrivate: true, type: 'Class C Private (192.168.x.x)' };
  }
  
  // 127.0.0.0 - 127.255.255.255 (Loopback)
  if (a === 127) {
    return { isPrivate: true, type: 'Loopback (127.x.x.x)' };
  }
  
  // 0.0.0.0
  if (a === 0 && b === 0 && c === 0 && d === 0) {
    return { isPrivate: true, type: 'Unspecified (0.0.0.0)' };
  }
  
  // 169.254.0.0 - 169.254.255.255 (Link-local)
  if (a === 169 && b === 254) {
    return { isPrivate: true, type: 'Link-Local (169.254.x.x)' };
  }

  return { isPrivate: false, type: null };
}

async function checkBlacklist(reversedIP, blacklist) {
  const query = `${reversedIP}.${blacklist.zone}`;
  
  try {
    const addresses = await dnsResolve4(query);
    
    // If DNS resolves, the IP is listed
    // The return codes indicate the reason (127.0.0.x)
    const returnCode = addresses[0] || null;
    
    return {
      name: blacklist.name,
      zone: blacklist.zone,
      description: blacklist.description,
      listed: true,
      returnCode: returnCode,
      reason: getReturnCodeMeaning(blacklist.zone, returnCode)
    };
    
  } catch (error) {
    // ENOTFOUND means the IP is NOT listed (this is good!)
    if (error.code === 'ENOTFOUND') {
      return {
        name: blacklist.name,
        zone: blacklist.zone,
        description: blacklist.description,
        listed: false,
        returnCode: null,
        reason: null
      };
    }
    
    // Other errors (timeout, DNS failure, etc.)
    return {
      name: blacklist.name,
      zone: blacklist.zone,
      description: blacklist.description,
      listed: false,
      error: true,
      errorMessage: error.code || error.message
    };
  }
}

function getReturnCodeMeaning(zone, code) {
  if (!code) return null;
  
  // Spamhaus return codes
  if (zone.includes('spamhaus')) {
    const meanings = {
      '127.0.0.2': 'SBL - Spamhaus Block List',
      '127.0.0.3': 'SBL CSS - Spamhaus CSS',
      '127.0.0.4': 'XBL - CBL (Exploits)',
      '127.0.0.5': 'XBL - NJABL proxies',
      '127.0.0.6': 'XBL - NJABL spam',
      '127.0.0.7': 'XBL - NJABL relay',
      '127.0.0.9': 'SBL - Drop/edrop',
      '127.0.0.10': 'PBL - ISP maintained',
      '127.0.0.11': 'PBL - Spamhaus maintained'
    };
    return meanings[code] || `Spamhaus listing (${code})`;
  }
  
  // Generic return code meaning
  return `Listed (${code})`;
}
