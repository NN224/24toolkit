import https from 'https';

export const config = {
  runtime: 'nodejs'
};

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
    // Get domain from query or body
    let domain = req.query.domain || req.body?.domain;
    
    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    // Clean domain - remove protocol and path
    domain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
    
    // Validate domain format
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain) && !domain.includes('.')) {
      return res.status(400).json({ error: 'Invalid domain format' });
    }

    // Get SSL certificate info
    const certInfo = await getSSLCertificate(domain);
    
    return res.status(200).json({
      success: true,
      domain: domain,
      certificate: certInfo
    });

  } catch (error) {
    console.error('SSL Check Error:', error);
    
    // Provide helpful error messages
    if (error.code === 'ENOTFOUND') {
      return res.status(400).json({ 
        error: 'Domain not found',
        message: `Could not resolve domain: ${error.hostname || 'unknown'}`
      });
    }
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(400).json({ 
        error: 'Connection refused',
        message: 'The server refused the connection on port 443'
      });
    }
    
    if (error.code === 'CERT_HAS_EXPIRED') {
      return res.status(200).json({
        success: true,
        domain: req.query.domain || req.body?.domain,
        certificate: {
          valid: false,
          expired: true,
          error: 'Certificate has expired'
        }
      });
    }

    return res.status(500).json({ 
      error: 'Failed to check SSL certificate',
      message: error.message 
    });
  }
}

function getSSLCertificate(domain) {
  return new Promise((resolve, reject) => {
    const options = {
      host: domain,
      port: 443,
      method: 'GET',
      rejectUnauthorized: false, // Allow self-signed certs for checking
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      const cert = res.socket.getPeerCertificate(true);
      
      if (!cert || Object.keys(cert).length === 0) {
        reject(new Error('No certificate found'));
        return;
      }

      // Parse certificate dates
      const validFrom = new Date(cert.valid_from);
      const validTo = new Date(cert.valid_to);
      const now = new Date();
      
      // Calculate days remaining
      const daysRemaining = Math.floor((validTo - now) / (1000 * 60 * 60 * 24));
      
      // Check if expired
      const isExpired = now > validTo;
      const isNotYetValid = now < validFrom;
      const isValid = !isExpired && !isNotYetValid;

      // Get issuer info
      const issuer = cert.issuer || {};
      const issuerName = issuer.O || issuer.CN || 'Unknown';
      
      // Get subject info
      const subject = cert.subject || {};
      const subjectName = subject.CN || domain;

      // Get SAN (Subject Alternative Names)
      const altNames = cert.subjectaltname ? 
        cert.subjectaltname.split(', ').map(n => n.replace('DNS:', '')) : 
        [subjectName];

      // Determine certificate type
      let certType = 'Domain Validated (DV)';
      if (issuer.O && (issuer.O.includes('Extended') || cert.subject?.O)) {
        certType = cert.subject?.O ? 'Organization Validated (OV)' : 'Extended Validation (EV)';
      }

      resolve({
        valid: isValid,
        expired: isExpired,
        notYetValid: isNotYetValid,
        daysRemaining: daysRemaining,
        
        // Dates
        validFrom: validFrom.toISOString(),
        validTo: validTo.toISOString(),
        validFromFormatted: validFrom.toLocaleDateString('en-US', { 
          year: 'numeric', month: 'long', day: 'numeric' 
        }),
        validToFormatted: validTo.toLocaleDateString('en-US', { 
          year: 'numeric', month: 'long', day: 'numeric' 
        }),
        
        // Issuer
        issuer: {
          name: issuerName,
          organization: issuer.O || null,
          country: issuer.C || null,
          commonName: issuer.CN || null
        },
        
        // Subject
        subject: {
          commonName: subject.CN || null,
          organization: subject.O || null,
          country: subject.C || null
        },
        
        // Technical details
        serialNumber: cert.serialNumber || null,
        fingerprint: cert.fingerprint || null,
        fingerprint256: cert.fingerprint256 || null,
        
        // SANs
        altNames: altNames,
        
        // Certificate type
        type: certType,
        
        // Protocol info
        protocol: res.socket.getProtocol ? res.socket.getProtocol() : 'TLS',
        cipher: res.socket.getCipher ? res.socket.getCipher() : null
      });
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Connection timeout'));
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}
