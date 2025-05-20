import { Schema, model, Document } from 'mongoose';

export interface IMushroom extends Document {
  scientificName: string;
  commonNames: string[];
  taxonomy?: {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
  };
  description?: string;
  distribution?: string; //geographical range
  substrateFormulation: { ingredient: string; percentage: number }[];
  substrateMoisture?: number;
  spawn?: {
    type: string;
    ratio?: number;
    sterilizationMethod?: string;
    coolingTemp?: number;
  };
  phases?: {
    colonization?: {
      temperature?: { min: number; max: number; unit: string };
      humidity?: { min: number; max: number; unit: string };
    };
    fruiting?: {
      induction?: {
        tempDrop?: boolean;
        humidityIncrease?: boolean;
        lightChange?: string;
        airExchange?: string;
      };
      temperature?: { min: number; max: number; unit: string };
      humidity?: { min: number; max: number; unit: string };
      CO2?: { min: number; max: number; unit: string };
      light?: string;
      duration?: string;
    };
  };
  expectedYield?: number;
  biologicalEfficiency?: number;
  flushCount?: number;
  cultivationMethod: string; //indoor or outdoor
  cultivationDifficulty?: {
    level: string; // "beginner", "intermediate", "advanced"
    challenges: string[];
    successRate?: number; // percentage
  };
  contaminationRisk: string;
  lifecycle?: {
    sporeGermination?: {
      temperature: { min: number; max: number; unit: string };
      medium: string[];
      timeframe: string;
    };
    myceliumGrowth?: {
      rate: string; // e.g., "slow", "moderate", "fast"
      characteristics: string[];
    };
    pinningTriggers?: string[];
    maturationTime?: string;
  };
  identification?: {
    cap?: {
      shape: string[];
      color: string[];
      diameter: { min: number; max: number; unit: string };
      surface: string[];
    };
    stem?: {
      height: { min: number; max: number; unit: string };
      thickness: { min: number; max: number; unit: string };
      color: string[];
      features: string[];
    };
    gillsOrPores?: {
      type: string; // "gills", "pores", "teeth", etc.
      attachment: string;
      spacing: string;
      color: string[];
    };
    sporeColor?: string;
    keyFeatures?: string[];
    bruisingCharacteristics?: string;
  };
  lookAlikes?: {
    species: string;
    similarities: string[];
    differences: string[];
    toxicity?: string;
  }[];
  seasonality?: {
    naturalFruitingSeasons: string[];
    preferredClimate: string[];
    habitat: string[];
    symbioticRelationships?: string[];
  };
  medicinalProperties?: {
    isMedicinal: boolean;
    bioactiveCompounds?: {
      name: string;
      concentration?: number;
      unit?: string;
      effects?: string[];
    }[];
    traditionalUses?: string[];
    clinicalStudies?: {
      condition: string;
      effectiveness: string; // e.g., "proven", "promising", "inconclusive"
      dosage?: {
        amount: number;
        unit: string;
        frequency: string;
      };
      studyReferences?: {
        title: string;
        authors: string[];
        journal?: string;
        year?: number;
        doi?: string;
        url?: string;
      }[];
    }[];
    extractionMethods?: {
      method: string; // e.g., "hot water", "alcohol", "dual extraction"
      targetCompounds: string[];
      efficiency?: number;
    }[];
    safetyProfile?: {
      contraindications?: string[];
      drugInteractions?: string[];
      sideEffects?: string[];
      toxicity?: string;
      allergenicity?: string;
    };
    preparationForms?: {
      form: string; // e.g., "powder", "tincture", "tea"
      instructions?: string;
      shelfLife?: string;
    }[];
  };
  culinaryUses?: {
    flavorProfile?: string[];
    texture?: string;
    cookingMethods?: string[];
    pairingRecommendations?: string[];
    nutritionalValue?: {
      protein?: number;
      carbohydrates?: number;
      fats?: number;
      fiber?: number;
      vitamins?: { name: string; amount: number; unit: string }[];
      minerals?: { name: string; amount: number; unit: string }[];
    };
    recipes?: {
      name: string;
      ingredients?: string[];
      instructions?: string;
      prepTime?: string;
      cookTime?: string;
      servings?: number;
    }[];
  };
  storage?: {
    methods: {
      method: string;
      procedure: string;
      shelfLife: string;
      effectOnProperties?: string;
    }[];
  };
  commercialData?: {
    marketValue?: {
      amount: number;
      currency: string;
      unit: string; // e.g., "per kg", "per pound"
      asOf: Date;
    };
    majorProducers?: string[];
    industryStandards?: string[];
  };
  sustainability?: {
    conservationStatus?: string;
    harvestingPractices?: string[];
    environmentalImpact?: string;
  };
  media?: {
    images?: {
      url: string;
      caption?: string;
      type?: string; // e.g., "fruiting body", "mycelium", "spores"
    }[];
    videos?: {
      url: string;
      title?: string;
      description?: string;
    }[];
    resources?: {
      title: string;
      type: string; // "article", "book", "website", etc.
      url?: string;
      description?: string;
    }[];
  };
}

const MushroomSchema = new Schema<IMushroom>(
  {
    scientificName: { type: String, required: true, unique: true },
    commonNames: [String],
    taxonomy: {
      kingdom: String,
      phylum: String,
      class: String,
      order: String,
      family: String,
      genus: String,
    },
    description: String,
    distribution: String,
    substrateFormulation: [
      {
        ingredient: String,
        percentage: Number,
      },
    ],
    substrateMoisture: { type: Number, min: 0, max: 100 },
    spawn: {
      type: String, //grain, liquid,
      ratio: Number,
      sterilizationMethod: String,
      coolingTemp: Number,
    },
    phases: {
      colonization: {
        temperature: {
          min: Number,
          max: Number,
          unit: String,
        },
        humidity: {
          min: Number,
          max: Number,
          unit: String,
        },
      },
      fruiting: {
        induction: {
          tempDrop: Boolean,
          humidityIncrease: Boolean,
          lightChange: String,
          airExchange: String,
        },
        temperature: {
          min: Number,
          max: Number,
          unit: String,
        },
        humidity: {
          min: Number,
          max: Number,
          unit: String,
        },
        CO2: {
          min: Number,
          max: Number,
          unit: String,
        },
        light: String,
        duration: String,
      },
    },
    expectedYield: Number,
    biologicalEfficiency: Number,
    flushCount: Number,
    cultivationMethod: String,
    cultivationDifficulty: {
      level: String,
      challenges: [String],
      successRate: Number,
    },
    contaminationRisk: String,
    lifecycle: {
      sporeGermination: {
        temperature: {
          min: Number,
          max: Number,
          unit: String,
        },
        medium: [String],
        timeframe: String,
      },
      myceliumGrowth: {
        rate: String,
        characteristics: [String],
      },
      pinningTriggers: [String],
      maturationTime: String,
    },
    identification: {
      cap: {
        shape: [String],
        color: [String],
        diameter: {
          min: Number,
          max: Number,
          unit: String,
        },
        surface: [String],
      },
      stem: {
        height: {
          min: Number,
          max: Number,
          unit: String,
        },
        thickness: {
          min: Number,
          max: Number,
          unit: String,
        },
        color: [String],
        features: [String],
      },
      gillsOrPores: {
        type: String,
        attachment: String,
        spacing: String,
        color: [String],
      },
      sporeColor: String,
      keyFeatures: [String],
      bruisingCharacteristics: String,
    },
    lookAlikes: [
      {
        species: String,
        similarities: [String],
        differences: [String],
        toxicity: String,
      },
    ],
    seasonality: {
      naturalFruitingSeasons: [String],
      preferredClimate: [String],
      habitat: [String],
      symbioticRelationships: [String],
    },
    medicinalProperties: {
      isMedicinal: Boolean,
      bioactiveCompounds: [
        {
          name: String,
          concentration: Number,
          unit: String,
          effects: [String],
        },
      ],
      traditionalUses: [String],
      clinicalStudies: [
        {
          condition: String,
          effectiveness: String,
          dosage: {
            amount: Number,
            unit: String,
            frequency: String,
          },
          studyReferences: [
            {
              title: String,
              authors: [String],
              journal: String,
              year: Number,
              doi: String,
              url: String,
            },
          ],
        },
      ],
      extractionMethods: [
        {
          method: String,
          targetCompounds: [String],
          efficiency: Number,
        },
      ],
      safetyProfile: {
        contraindications: [String],
        drugInteractions: [String],
        sideEffects: [String],
        toxicity: String,
        allergenicity: String,
      },
      preparationForms: [
        {
          form: String,
          instructions: String,
          shelfLife: String,
        },
      ],
    },
    culinaryUses: {
      flavorProfile: [String],
      texture: String,
      cookingMethods: [String],
      pairingRecommendations: [String],
      nutritionalValue: {
        protein: Number,
        carbohydrates: Number,
        fats: Number,
        fiber: Number,
        vitamins: [
          {
            name: String,
            amount: Number,
            unit: String,
          },
        ],
        minerals: [
          {
            name: String,
            amount: Number,
            unit: String,
          },
        ],
      },
      recipes: [
        {
          name: String,
          ingredients: [String],
          instructions: String,
          prepTime: String,
          cookTime: String,
          servings: Number,
        },
      ],
    },
    storage: {
      methods: [
        {
          method: String,
          procedure: String,
          shelfLife: String,
          effectOnProperties: String,
        },
      ],
    },
    commercialData: {
      marketValue: {
        amount: Number,
        currency: String,
        unit: String,
        asOf: Date,
      },
      majorProducers: [String],
      industryStandards: [String],
    },
    sustainability: {
      conservationStatus: String,
      harvestingPractices: [String],
      environmentalImpact: String,
    },
    media: {
      images: [
        {
          url: String,
          caption: String,
          type: String,
        },
      ],
      videos: [
        {
          url: String,
          title: String,
          description: String,
        },
      ],
      resources: [
        {
          title: String,
          type: String,
          url: String,
          description: String,
        },
      ],
    },
  },
  { timestamps: true }
);

export default model<IMushroom>('Mushroom', MushroomSchema);
