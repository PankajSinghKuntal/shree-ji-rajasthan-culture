
// Mock implementation for Gemini service
// Replace with actual API calls when API key is available

export async function getCulturalInsight(category: string, _productName: string): Promise<string> {
  try {
    // Mock response for development
    const insights: Record<string, string> = {
      clothes: "Woven with royal threads, each garment tells tales of ancient kingdoms and timeless elegance.",
      jewellery: "Adorned with celestial radiance, these pieces carry the legacy of Rajasthan's golden heritage.",
      flower_tea: "Steeped in tradition, each sip connects you to the aromatic gardens of the desert kingdom.",
      home_decor: "Crafted with ancestral wisdom, these treasures transform spaces into palaces of beauty."
    };
    
    const key = category.toLowerCase().replace(' ', '_');
    return insights[key] || "A timeless piece of Rajasthan's golden heritage.";
  } catch (error) {
    console.error("Cultural insight error:", error);
    return "A timeless piece of Rajasthan's golden heritage.";
  }
}

export async function generateProductDescription(_productName: string): Promise<string> {
  try {
    // Mock response for development
    const descriptions: Record<string, string> = {
      default: "Handcrafted with love by local artisans using techniques passed down through generations. Each piece reflects the rich heritage and cultural pride of Rajasthan."
    };
    
    return descriptions.default;
  } catch (error) {
    console.error("Description generation error:", error);
    return "Handcrafted with love by local artisans using techniques passed down through generations.";
  }
}
