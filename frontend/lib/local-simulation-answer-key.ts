import "server-only";

import type { DentalCondition, ToothFinding } from "@/lib/types";

type LocalSimulationAnswer = {
  dominantCondition: DentalCondition;
  referenceFindings: ToothFinding[];
  aiFindings: ToothFinding[];
};

export const localSimulationAnswerKey: Record<string, LocalSimulationAnswer> = {
  "q1": {
    "referenceFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "24",
          "25",
          "26",
          "27",
          "45",
          "44",
          "43"
        ]
      },
      {
        "condition": "Implant",
        "toothIds": [
          "25",
          "26",
          "46",
          "45"
        ]
      }
    ],
    "aiFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "24",
          "25",
          "26",
          "27",
          "45",
          "44",
          "43"
        ]
      },
      {
        "condition": "Implant",
        "toothIds": [
          "25",
          "26",
          "46",
          "45"
        ]
      }
    ],
    "dominantCondition": "Fillings"
  },
  "q2": {
    "referenceFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "23",
          "24",
          "26",
          "27",
          "28",
          "48",
          "44",
          "43",
          "41"
        ]
      },
      {
        "condition": "Implant",
        "toothIds": [
          "24",
          "27"
        ]
      }
    ],
    "aiFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "23",
          "24",
          "26",
          "27",
          "28",
          "48",
          "44",
          "43",
          "41"
        ]
      },
      {
        "condition": "Implant",
        "toothIds": [
          "24",
          "27"
        ]
      }
    ],
    "dominantCondition": "Fillings"
  },
  "q3": {
    "referenceFindings": [
      {
        "condition": "Cavity",
        "toothIds": [
          "27"
        ]
      }
    ],
    "aiFindings": [
      {
        "condition": "Cavity",
        "toothIds": [
          "27"
        ]
      }
    ],
    "dominantCondition": "Cavity"
  },
  "q4": {
    "referenceFindings": [
      {
        "condition": "Cavity",
        "toothIds": [
          "27",
          "44"
        ]
      },
      {
        "condition": "Implant",
        "toothIds": [
          "24",
          "45",
          "43"
        ]
      }
    ],
    "aiFindings": [
      {
        "condition": "Cavity",
        "toothIds": [
          "27",
          "44"
        ]
      },
      {
        "condition": "Implant",
        "toothIds": [
          "24",
          "45",
          "43"
        ]
      }
    ],
    "dominantCondition": "Implant"
  },
  "q5": {
    "referenceFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "11",
          "22",
          "23",
          "25",
          "44",
          "43",
          "31"
        ]
      }
    ],
    "aiFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "11",
          "22",
          "23",
          "25",
          "44",
          "43",
          "31"
        ]
      }
    ],
    "dominantCondition": "Fillings"
  },
  "q6": {
    "referenceFindings": [
      {
        "condition": "Cavity",
        "toothIds": [
          "11"
        ]
      },
      {
        "condition": "Fillings",
        "toothIds": [
          "21",
          "23",
          "24",
          "25",
          "27",
          "42",
          "31"
        ]
      },
      {
        "condition": "Implant",
        "toothIds": [
          "22",
          "45",
          "43"
        ]
      }
    ],
    "aiFindings": [
      {
        "condition": "Cavity",
        "toothIds": [
          "11"
        ]
      },
      {
        "condition": "Fillings",
        "toothIds": [
          "21",
          "23",
          "24",
          "25",
          "27",
          "42",
          "31"
        ]
      },
      {
        "condition": "Implant",
        "toothIds": [
          "22",
          "45",
          "43"
        ]
      }
    ],
    "dominantCondition": "Fillings"
  },
  "q7": {
    "referenceFindings": [
      {
        "condition": "Cavity",
        "toothIds": [
          "42"
        ]
      },
      {
        "condition": "Impacted Tooth",
        "toothIds": [
          "11",
          "21",
          "41"
        ]
      }
    ],
    "aiFindings": [
      {
        "condition": "Cavity",
        "toothIds": [
          "42"
        ]
      },
      {
        "condition": "Impacted Tooth",
        "toothIds": [
          "11",
          "21",
          "41"
        ]
      }
    ],
    "dominantCondition": "Impacted Tooth"
  },
  "q8": {
    "referenceFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "22",
          "23",
          "46",
          "45",
          "43"
        ]
      },
      {
        "condition": "Implant",
        "toothIds": [
          "26"
        ]
      },
      {
        "condition": "Impacted Tooth",
        "toothIds": [
          "12"
        ]
      }
    ],
    "aiFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "22",
          "23",
          "46",
          "45",
          "43"
        ]
      },
      {
        "condition": "Implant",
        "toothIds": [
          "26"
        ]
      },
      {
        "condition": "Impacted Tooth",
        "toothIds": [
          "12"
        ]
      }
    ],
    "dominantCondition": "Fillings"
  },
  "q9": {
    "referenceFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "22",
          "23",
          "25",
          "45",
          "44",
          "43",
          "42"
        ]
      },
      {
        "condition": "Impacted Tooth",
        "toothIds": [
          "11"
        ]
      }
    ],
    "aiFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "22",
          "23",
          "25",
          "45",
          "44",
          "43",
          "42"
        ]
      },
      {
        "condition": "Impacted Tooth",
        "toothIds": [
          "11"
        ]
      }
    ],
    "dominantCondition": "Fillings"
  },
  "q10": {
    "referenceFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "22",
          "23",
          "24",
          "25",
          "26",
          "46",
          "45",
          "44"
        ]
      },
      {
        "condition": "Implant",
        "toothIds": [
          "48",
          "45"
        ]
      }
    ],
    "aiFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "22",
          "23",
          "24",
          "25",
          "26",
          "46",
          "45",
          "44"
        ]
      },
      {
        "condition": "Implant",
        "toothIds": [
          "48",
          "45"
        ]
      }
    ],
    "dominantCondition": "Fillings"
  },
  "q11": {
    "referenceFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "24",
          "26"
        ]
      },
      {
        "condition": "Implant",
        "toothIds": [
          "23",
          "24",
          "25",
          "26",
          "47",
          "46",
          "45",
          "44"
        ]
      }
    ],
    "aiFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "24",
          "26"
        ]
      },
      {
        "condition": "Implant",
        "toothIds": [
          "23",
          "24",
          "25",
          "26",
          "47",
          "46",
          "45",
          "44"
        ]
      }
    ],
    "dominantCondition": "Implant"
  },
  "q12": {
    "referenceFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "22",
          "24",
          "27",
          "45",
          "44",
          "43",
          "41"
        ]
      },
      {
        "condition": "Implant",
        "toothIds": [
          "26"
        ]
      }
    ],
    "aiFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "22",
          "24",
          "27",
          "45",
          "44",
          "43",
          "41"
        ]
      },
      {
        "condition": "Implant",
        "toothIds": [
          "26"
        ]
      }
    ],
    "dominantCondition": "Fillings"
  },
  "q13": {
    "referenceFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "44",
          "42"
        ]
      }
    ],
    "aiFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "44",
          "42"
        ]
      }
    ],
    "dominantCondition": "Fillings"
  },
  "q14": {
    "referenceFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "24",
          "25",
          "26",
          "45",
          "44"
        ]
      }
    ],
    "aiFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "24",
          "25",
          "26",
          "45",
          "44"
        ]
      }
    ],
    "dominantCondition": "Fillings"
  },
  "q15": {
    "referenceFindings": [
      {
        "condition": "Implant",
        "toothIds": [
          "27"
        ]
      }
    ],
    "aiFindings": [
      {
        "condition": "Implant",
        "toothIds": [
          "27"
        ]
      }
    ],
    "dominantCondition": "Implant"
  },
  "q16": {
    "referenceFindings": [
      {
        "condition": "Impacted Tooth",
        "toothIds": [
          "21",
          "22",
          "31"
        ]
      }
    ],
    "aiFindings": [
      {
        "condition": "Impacted Tooth",
        "toothIds": [
          "21",
          "22",
          "31"
        ]
      }
    ],
    "dominantCondition": "Impacted Tooth"
  },
  "q17": {
    "referenceFindings": [
      {
        "condition": "Cavity",
        "toothIds": [
          "12",
          "43"
        ]
      }
    ],
    "aiFindings": [
      {
        "condition": "Cavity",
        "toothIds": [
          "12",
          "43"
        ]
      }
    ],
    "dominantCondition": "Cavity"
  },
  "q18": {
    "referenceFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "24",
          "25",
          "27",
          "44",
          "43",
          "42"
        ]
      }
    ],
    "aiFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "24",
          "25",
          "27",
          "44",
          "43",
          "42"
        ]
      }
    ],
    "dominantCondition": "Fillings"
  },
  "q19": {
    "referenceFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "44"
        ]
      },
      {
        "condition": "Implant",
        "toothIds": [
          "26"
        ]
      }
    ],
    "aiFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "44"
        ]
      },
      {
        "condition": "Implant",
        "toothIds": [
          "26"
        ]
      }
    ],
    "dominantCondition": "Fillings"
  },
  "q20": {
    "referenceFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "23",
          "26",
          "46",
          "45",
          "44",
          "42",
          "41"
        ]
      },
      {
        "condition": "Implant",
        "toothIds": [
          "24",
          "25",
          "46",
          "44",
          "43"
        ]
      }
    ],
    "aiFindings": [
      {
        "condition": "Fillings",
        "toothIds": [
          "23",
          "26",
          "46",
          "45",
          "44",
          "42",
          "41"
        ]
      },
      {
        "condition": "Implant",
        "toothIds": [
          "24",
          "25",
          "46",
          "44",
          "43"
        ]
      }
    ],
    "dominantCondition": "Fillings"
  }
};
