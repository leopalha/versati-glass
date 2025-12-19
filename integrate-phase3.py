#!/usr/bin/env python3
"""
Phase 3 Integration Script for step-details.tsx
Applies all Phase 3 components according to FASE4_STEP_DETAILS_CHANGES.md
"""

import re

# Read the backup file
with open('src/components/quote/steps/step-details.tsx.backup', 'r', encoding='utf-8') as f:
    content = f.read()

print("Applying Phase 3 integrations...")

# 1. Add imports after catalog-options
imports_addition = """} from '@/lib/catalog-options'
// Phase 3 - NBR Validations & Smart Suggestions
import { validateDimensions } from '@/lib/nbr-validations'
import type { QuoteContext, Suggestion } from '@/lib/smart-suggestions'
import { ThicknessCalculator } from '@/components/quote/thickness-calculator'
import { SmartSuggestionsPanel } from '@/components/quote/smart-suggestions-panel'
import { ProductReferenceImages } from '@/components/quote/product-reference-images'
"""
content = content.replace("} from '@/lib/catalog-options'", imports_addition)
print("OK Step 1: Imports added")

# 2. Add locationData to useQuoteStore destructuring
content = content.replace(
    "const {\n    currentItem,",
    "const {\n    currentItem,\n    locationData, // Phase 3",
)
print("OK Step 2: locationData added to useQuoteStore")

# 3. Add showDimensions helper after category declaration
category_pattern = r"(const category = existingItem\?\.category \|\| currentProduct\?\.category \|\| currentItem\?\.category)"
showDimensions_addition = r"\1\n\n  // Phase 3: Helper for showing dimensions\n  const showDimensions = category !== 'SERVICOS' && category !== 'FERRAGENS' && category !== 'KITS'"
content = re.sub(category_pattern, showDimensions_addition, content)
print("OK Step 3: showDimensions helper added")

# 4. Add suggestionContext after serviceUrgency state
suggestion_context = """
  // Phase 3: Context for smart suggestions
  const suggestionContext = useMemo<QuoteContext>(
    () => ({
      category: category || '',
      width: width ? parseFloat(width) : undefined,
      height: height ? parseFloat(height) : undefined,
      glassType,
      model,
      color,
      thickness: thickness ? parseInt(thickness) : undefined,
      finish,
      glassColor,
      glassTexture,
      hasteSize,
    }),
    [category, width, height, glassType, model, color, thickness, finish, glassColor, glassTexture, hasteSize]
  )
"""
content = content.replace(
    "const [serviceUrgency, setServiceUrgency] = useState('')",
    "const [serviceUrgency, setServiceUrgency] = useState('')" + suggestion_context
)
print("OK Step 4: suggestionContext added")

# 5. Add handleApplySuggestion callback after removeImage
handle_apply_suggestion = """
  // Phase 3: Handle applying suggestions
  const handleApplySuggestion = useCallback(
    (suggestion: Suggestion) => {
      switch (suggestion.field) {
        case 'thickness':
          setThickness(suggestion.value)
          break
        case 'glassType':
          setGlassType(suggestion.value)
          break
        case 'finish':
          setFinish(suggestion.value)
          break
        case 'color':
          setColor(suggestion.value)
          break
        case 'glassColor':
          setGlassColor(suggestion.value)
          break
        case 'model':
          setModel(suggestion.value)
          break
        case 'finishLine':
          setFinishLine(suggestion.value)
          break
        case 'ledTemp':
          setLedTemp(suggestion.value)
          break
        case 'shape':
          setShape(suggestion.value)
          break
        case 'bisoteWidth':
          setBisoteWidth(suggestion.value)
          break
      }

      toast({
        title: 'Sugestão aplicada',
        description: suggestion.reason,
      })
    },
    [toast]
  )
"""
removeImage_pattern = r"(const removeImage = \(index: number\) => \{[^}]+\})"
content = re.sub(removeImage_pattern, r"\1" + handle_apply_suggestion, content)
print("OK Step 5: handleApplySuggestion added")

# 6. Add NBR validation in handleContinue
nbr_validation = """
    // Phase 3: NBR Validation (BEFORE creating newItem)
    if (width && height && thickness && category) {
      const w = parseFloat(width)
      const h = parseFloat(height)
      const t = parseInt(thickness)

      const validation = validateDimensions(
        { width: w, height: h, thickness: t },
        category as any
      )

      if (!validation.valid) {
        toast({
          variant: 'destructive',
          title: 'Dimensões não atendem às normas NBR',
          description: validation.message,
        })
        return // Block submission
      }

      if (validation.warning) {
        toast({
          title: 'Atenção',
          description: validation.warning,
        })
      }
    }

"""
content = content.replace(
    "const widthNum = parseFloat(width) || 0\n    const heightNum = parseFloat(height) || 0\n\n    // Construir descrição detalhada",
    "const widthNum = parseFloat(width) || 0\n    const heightNum = parseFloat(height) || 0\n" + nbr_validation + "    // Construir descrição detalhada"
)
print("OK Step 6: NBR validation added to handleContinue")

# 7. Add ThicknessCalculator JSX after height input
thickness_calc_jsx = """
          {/* Phase 3: Thickness Calculator */}
          {showDimensions && width && height && parseFloat(width) > 0 && parseFloat(height) > 0 && (
            <ThicknessCalculator
              width={parseFloat(width)}
              height={parseFloat(height)}
              application={category as any}
              currentThickness={thickness ? parseInt(thickness) : undefined}
              windZone={locationData?.windZone || 2}
              onApplyThickness={(t) => setThickness(t.toString())}
            />
          )}

"""
# Find the end of height Input and add calculator
height_input_end = """              </div>
            </div>
          )}

          {/* Quantity */}"""
content = content.replace(height_input_end, """              </div>
            </div>
          )}

""" + thickness_calc_jsx + """          {/* Quantity */}""")
print("OK Step 7: ThicknessCalculator JSX added")

# 8. Add ProductReferenceImages after Product Name section
product_ref_images_jsx = """
          {/* Phase 3: Product Reference Images */}
          {category && (
            <ProductReferenceImages
              category={category}
              subcategory={model}
              maxImages={4}
              showTitle={true}
            />
          )}

"""
product_name_end = """            </p>
          </div>

          {/* Measurements */}"""
content = content.replace(product_name_end, """            </p>
          </div>

""" + product_ref_images_jsx + """          {/* Measurements */}""")
print("OK Step 8: ProductReferenceImages JSX added")

# 9. Add SmartSuggestionsPanel before closing </div> of form
smart_suggestions_jsx = """
          {/* Phase 3: Smart Suggestions */}
          <SmartSuggestionsPanel
            context={suggestionContext}
            onApplySuggestion={handleApplySuggestion}
            maxSuggestions={3}
            minConfidence="medium"
          />
"""
# Find the end of image upload section and add suggestions panel before </div></Card>
upload_section_end = """            )}
          </div>
        </div>
      </Card>"""
content = content.replace(upload_section_end, """            )}
          </div>

""" + smart_suggestions_jsx + """        </div>
      </Card>""")
print("OK Step 9: SmartSuggestionsPanel JSX added")

# Write the updated file
with open('src/components/quote/steps/step-details.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nSUCCESS Phase 3 integration completed successfully!")
print("📁 File updated: src/components/quote/steps/step-details.tsx")
print("\nNext step: Run TypeScript check with:")
print("  npx tsc --noEmit | grep step-details")
