import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Sparkle, 
  Copy, 
  Trash, 
  Plus, 
  ArrowRight,
  MagnifyingGlass,
  Lightning
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { AIBadge } from '@/components/ai/AIBadge'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'
import { RelatedTools } from '@/components/RelatedTools'
import { 
  getAllPresets,
  getPresetCategories,
  fillTemplate,
  deleteUserPreset,
  type PromptPreset
} from '@/lib/ai-presets'
import { Link } from 'react-router-dom'
import { allTools } from '@/lib/tools-data'

export default function AIPromptPresets() {
  const { t } = useTranslation()
  const metadata = getPageMetadata('ai-prompt-presets')
  useSEO({ ...metadata, canonicalPath: '/tools/ai-prompt-presets' })

  // Use SEO H1 if available, otherwise fall back to translation
  const pageH1 = metadata.h1 || t('tools.aIPromptPresets.name')
  const [presets, setPresets] = useState<PromptPreset[]>([])
  const [selectedPreset, setSelectedPreset] = useState<PromptPreset | null>(null)
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [isArabic, setIsArabic] = useState(false)
  const copyToClipboard = useCopyToClipboard()

  const categories = getPresetCategories()

  useEffect(() => {
    const html = document.documentElement
    setIsArabic(html.dir === 'rtl' || html.lang === 'ar')
    setPresets(getAllPresets())
  }, [])

  const filteredPresets = presets.filter(preset => {
    const matchesSearch = searchQuery === '' || 
      preset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      preset.nameAr.includes(searchQuery) ||
      preset.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = activeCategory === 'all' || preset.category === activeCategory
    
    return matchesSearch && matchesCategory
  })

  const selectPreset = (preset: PromptPreset) => {
    setSelectedPreset(preset)
    setVariableValues({})
    setGeneratedPrompt('')
  }

  const handleVariableChange = (name: string, value: string) => {
    setVariableValues(prev => ({ ...prev, [name]: value }))
  }

  const generatePrompt = () => {
    if (!selectedPreset) return
    
    // Check if all variables are filled
    const missingVars = selectedPreset.variables.filter(v => !variableValues[v.name]?.trim())
    if (missingVars.length > 0) {
      toast.error(t('tools.aiPromptPresets.fillMissingFields', { fields: missingVars.map(v => v.name).join(', ') }))
      return
    }
    
    const prompt = fillTemplate(selectedPreset.template, variableValues)
    setGeneratedPrompt(prompt)
    toast.success(t('tools.aiPromptPresets.promptGenerated'))
  }

  const handleDeletePreset = (presetId: string) => {
    if (confirm(t('tools.aiPromptPresets.deleteConfirm'))) {
      if (deleteUserPreset(presetId)) {
        setPresets(getAllPresets())
        if (selectedPreset?.id === presetId) {
          setSelectedPreset(null)
        }
        toast.success(t('tools.aiPromptPresets.deleted'))
      }
    }
  }

  const getToolPath = (toolId: string) => {
    const tool = allTools.find(t => t.id === toolId)
    return tool?.path || '/tools/text-summarizer'
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-semibold text-foreground tracking-tight">
              AI Prompt Presets
            </h1>
            <AIBadge />
          </div>
          <p className="text-lg text-muted-foreground">
            Use ready-made templates to save time and improve AI results
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Preset List */}
          <div className="space-y-4">
            {/* Search & Filter */}
            <Card>
              <CardContent className="pt-4 space-y-4">
                <div className="relative">
                  <MagnifyingGlass size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder={t('tools.aiPromptPresets.searchPresets')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={activeCategory === 'all' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setActiveCategory('all')}
                  >
                    {t('tools.aiPromptPresets.all')}
                  </Badge>
                  {categories.map(cat => (
                    <Badge
                      key={cat.id}
                      variant={activeCategory === cat.id ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      {cat.icon} {cat.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preset List */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  Presets ({filteredPresets.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredPresets.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => selectPreset(preset)}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        selectedPreset?.id === preset.id
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-border hover:border-purple-500/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xl">{preset.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground text-sm truncate">
                              {preset.name}
                            </span>
                            {preset.isUserCreated && (
                              <Badge variant="secondary" className="text-xs">
                                Custom
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {preset.description}
                          </p>
                        </div>
                        {preset.isUserCreated && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeletePreset(preset.id)
                            }}
                            className="p-1 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-500"
                          >
                            <Trash size={14} />
                          </button>
                        )}
                      </div>
                    </button>
                  ))}
                  
                  {filteredPresets.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No presets found
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Fill Variables */}
          <div className="space-y-4">
            {selectedPreset ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{selectedPreset.icon}</span>
                    <div>
                      <CardTitle>{selectedPreset.name}</CardTitle>
                      <CardDescription>
                        {selectedPreset.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedPreset.variables.map(variable => (
                    <div key={variable.name} className="space-y-2">
                      <Label htmlFor={variable.name}>
                        {variable.name}
                      </Label>
                      
                      {variable.type === 'select' && variable.options ? (
                        <Select
                          value={variableValues[variable.name] || ''}
                          onValueChange={(value) => handleVariableChange(variable.name, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={variable.placeholder} />
                          </SelectTrigger>
                          <SelectContent>
                            {variable.options.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : variable.type === 'textarea' ? (
                        <Textarea
                          id={variable.name}
                          placeholder={variable.placeholder}
                          value={variableValues[variable.name] || ''}
                          onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                          className="min-h-[100px]"
                        />
                      ) : (
                        <Input
                          id={variable.name}
                          placeholder={variable.placeholder}
                          value={variableValues[variable.name] || ''}
                          onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                        />
                      )}
                    </div>
                  ))}

                  <Button
                    onClick={generatePrompt}
                    className="w-full gap-2 bg-gradient-to-r from-purple-600 to-sky-500"
                  >
                    <Lightning size={18} weight="fill" />
                    Generate Prompt
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/10 to-sky-500/10 flex items-center justify-center mx-auto mb-4">
                    <Sparkle size={32} className="text-purple-500" />
                  </div>
                  <p className="text-muted-foreground">
                    Select a preset to get started
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Generated Prompt */}
          <div className="space-y-4">
            <Card className="border-2 border-accent/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Generated Prompt</CardTitle>
                  {generatedPrompt && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(generatedPrompt, t('common.copied'))}
                      className="gap-1"
                    >
                      <Copy size={14} />
                      {t('common.copy')}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {generatedPrompt ? (
                  <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4 min-h-[200px]">
                      <p className="whitespace-pre-wrap text-foreground text-sm">
                        {generatedPrompt}
                      </p>
                    </div>
                    
                    {selectedPreset && (
                      <Link to={getToolPath(selectedPreset.toolId)}>
                        <Button className="w-full gap-2" variant="outline">
                          Use in Tool
                          <ArrowRight size={16} />
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/10 to-sky-500/10 flex items-center justify-center mb-4">
                      <Lightning size={28} className="text-purple-500" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Fill variables and click Generate
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkle size={16} weight="fill" className="text-yellow-500" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-2">
                <p>• Be specific in variables for better results</p>
                <p>• You can edit the generated prompt before using</p>
                <p>• Try different presets for the same goal</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    {/* Related Tools for internal linking */}
    <RelatedTools currentToolId="ai-prompt-presets" category="ai" />
    </div>
  )
}
