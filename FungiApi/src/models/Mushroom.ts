import { Schema, model, Document } from 'mongoose';

export enum TrophicMode {
  Saprotrophic = "saprotrophic",
  Mycorrhizal = "mycorrhizal",
  Parasitic = "parasitic",
  Endophytic = "endophytic",
  Lichenized = "lichenized",
  Mixotrophic = "mixotrophic",
}

export enum CultivationMethod {
  Indoor = "indoor",
  Outdoor = "outdoor",
  Both = "both",
}

export enum DifficultyLevel {
  Beginner = "beginner",
  Intermediate = "intermediate",
  Advanced = "advanced",
}

export enum ContaminationRisk {
  Low = "low",
  Moderate = "moderate",
  High = "high",
  VeryHigh = "very_high",
}

export enum LightChange {
  None = "none",
  Low = "low",
  Moderate = "moderate",
  High = "high",
  NaturalCycle = "natural_cycle",
}

export enum AirExchange {
  Passive = "passive",
  Active = "active",
  None = "none",
}

export enum GillType {
  Gills = "gills",
  Pores = "pores",
  Teeth = "teeth",
  Ridges = "ridges",
  None = "none",
}

export enum ResourceType {
  Article = "article",
  Book = "book",
  Website = "website",
  Video = "video",
  Journal = "journal",
}

export enum Visibility {
  Public = "public",
  Private = "private",
  Restricted = "restricted",
}

export interface IMushroom extends Document {
  uuid: string;
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
  trophicModes?: TrophicMode[];
  description?: string;
  distribution?: string;
  agarTypes?: {
    acronym: string;
    fullName: string;
    description?: string;
  }[];
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
        lightChange?: LightChange;
        airExchange?: AirExchange;
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
  cultivationMethod: CultivationMethod;
  cultivationDifficulty?: {
    level: DifficultyLevel;
    challenges: string[];
    successRate?: number;
  };
  contaminationRisk: ContaminationRisk;
  lifecycle?: {
    sporeGermination?: {
      temperature: { min: number; max: number; unit: string };
      medium: string[];
      timeframe: string;
    };
    myceliumGrowth?: {
      rate: string;
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
      type: GillType;
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
      effectiveness: string;
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
      method: string;
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
      form: string;
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
      unit: string;
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
      type?: string;
    }[];
    videos?: {
      url: string;
      title?: string;
      description?: string;
    }[];
    resources?: {
      title: string;
      type: ResourceType;
      url?: string;
      description?: string;
    }[];
  };

  // ✅ NEW: Tags and classification booleans
  tags?: string[];
  isEdible?: boolean;
  isPoisonous?: boolean;
  isPsychoactive?: boolean;

  // ✅ NEW: Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  verified?: boolean;

  // ✅ NEW: Access control
  visibility?: Visibility;
  accessRoles?: string[];
}

const MushroomSchema = new Schema(
  {
    uuid: { type: String, required: true, unique: true },
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
    agarTypes: [
      {
        acronym: String,
        fullName: String,
        description: String,
      },
    ],
    substrateFormulation: [
      {
        ingredient: String,
        percentage: Number,
      },
    ],
    substrateMoisture: { type: Number, min: 0, max: 100 },
    spawn: {
      type: String,
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

    // ✅ New fields for API base
    tags: [String],
    isEdible: Boolean,
    isPoisonous: Boolean,
    isPsychoactive: Boolean,
    createdBy: String,
    verified: Boolean,
    visibility: { type: String, enum: ["public", "private", "restricted"], default: "private" },
    accessRoles: [String],
  },
  { timestamps: true }
);

export default model<IMushroom>('Mushroom', MushroomSchema);
