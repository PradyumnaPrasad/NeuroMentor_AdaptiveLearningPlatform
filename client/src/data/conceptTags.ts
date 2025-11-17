/**
 * Concept Tags Helper
 * Maps chapters to their concept tags for AI learning
 */

export const CONCEPT_TAGS: Record<string, string[]> = {
  // Class 1 Math
  'class1-math-shapes-and-space': ['shapes', 'geometry', 'visual-recognition', 'spatial-awareness'],
  'class1-math-numbers-from-1-to-9': ['counting', 'numbers', 'basic-math', 'number-recognition'],
  
  // Class 1 Science
  'class1-science-living-and-non-living': ['classification', 'observation', 'living-things', 'biology'],
  'class1-science-my-body': ['anatomy', 'body-parts', 'health', 'human-body'],
  
  // Class 2 Math
  'class2-math-numbers-up-to-100': ['counting', 'numbers', 'place-value', 'number-sense'],
  'class2-math-addition-subtraction': ['addition', 'subtraction', 'arithmetic', 'basic-operations'],
  
  // Class 2 Science
  'class2-science-plants-around-us': ['plants', 'nature', 'observation', 'botany'],
  'class2-science-animals': ['animals', 'habitats', 'classification', 'zoology'],
  
  // Class 3 Math
  'class3-math-multiplication': ['multiplication', 'tables', 'arithmetic', 'times-tables'],
  'class3-math-division': ['division', 'arithmetic', 'problem-solving', 'sharing'],
  
  // Class 3 Science
  'class3-science-water': ['water', 'states-of-matter', 'science', 'chemistry'],
  'class3-science-air': ['air', 'atmosphere', 'science', 'physics'],
};

export function getConceptTags(chapterId: string): string[] {
  return CONCEPT_TAGS[chapterId] || ['general-knowledge'];
}
