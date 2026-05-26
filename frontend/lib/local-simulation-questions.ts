import type { QuizQuestion } from "@/lib/types";

export const localSimulationQuestions: QuizQuestion[] = [
  {
    "id": "q1",
    "imageUrl": "/dataset/case1.jpg",
    "storagePath": "static:/dataset/case1.jpg",
    "questionText": "Identify the dominant radiographic finding in this dental image.",
    "choices": [
      "Cavity",
      "Fillings",
      "Implant",
      "Impacted Tooth"
    ],
    "aiPrediction": "Fillings",
    "aiConfidence": 0.94,
    "difficulty": "hard",
    "datasetVersion": "dataset_v1",
    "annotations": [
      {
        "label": "Implant",
        "xmin": 195,
        "ymin": 169,
        "xmax": 209,
        "ymax": 212
      },
      {
        "label": "Implant",
        "xmin": 288,
        "ymin": 171,
        "xmax": 301,
        "ymax": 205
      },
      {
        "label": "Implant",
        "xmin": 203,
        "ymin": 107,
        "xmax": 217,
        "ymax": 150
      },
      {
        "label": "Implant",
        "xmin": 287,
        "ymin": 104,
        "xmax": 302,
        "ymax": 150
      },
      {
        "label": "Implant",
        "xmin": 301,
        "ymin": 103,
        "xmax": 312,
        "ymax": 150
      },
      {
        "label": "Fillings",
        "xmin": 164,
        "ymin": 158,
        "xmax": 195,
        "ymax": 197
      },
      {
        "label": "Fillings",
        "xmin": 322,
        "ymin": 159,
        "xmax": 355,
        "ymax": 200
      },
      {
        "label": "Fillings",
        "xmin": 300,
        "ymin": 159,
        "xmax": 330,
        "ymax": 206
      },
      {
        "label": "Fillings",
        "xmin": 331,
        "ymin": 111,
        "xmax": 354,
        "ymax": 150
      },
      {
        "label": "Fillings",
        "xmin": 310,
        "ymin": 110,
        "xmax": 332,
        "ymax": 152
      },
      {
        "label": "Fillings",
        "xmin": 185,
        "ymin": 111,
        "xmax": 204,
        "ymax": 152
      },
      {
        "label": "Fillings",
        "xmin": 209,
        "ymin": 160,
        "xmax": 223,
        "ymax": 202
      },
      {
        "label": "Fillings",
        "xmin": 221,
        "ymin": 160,
        "xmax": 233,
        "ymax": 201
      }
    ]
  },
  {
    "id": "q2",
    "imageUrl": "/dataset/case2.jpg",
    "storagePath": "static:/dataset/case2.jpg",
    "questionText": "Identify the dominant radiographic finding in this dental image.",
    "choices": [
      "Cavity",
      "Fillings",
      "Implant",
      "Impacted Tooth"
    ],
    "aiPrediction": "Fillings",
    "aiConfidence": 0.95,
    "difficulty": "hard",
    "datasetVersion": "dataset_v1",
    "annotations": [
      {
        "label": "Fillings",
        "xmin": 251,
        "ymin": 91,
        "xmax": 272,
        "ymax": 148
      },
      {
        "label": "Fillings",
        "xmin": 234,
        "ymin": 95,
        "xmax": 251,
        "ymax": 147
      },
      {
        "label": "Fillings",
        "xmin": 216,
        "ymin": 122,
        "xmax": 235,
        "ymax": 144
      },
      {
        "label": "Fillings",
        "xmin": 200,
        "ymin": 124,
        "xmax": 218,
        "ymax": 147
      },
      {
        "label": "Fillings",
        "xmin": 183,
        "ymin": 104,
        "xmax": 199,
        "ymax": 146
      },
      {
        "label": "Implant",
        "xmin": 171,
        "ymin": 102,
        "xmax": 184,
        "ymax": 148
      },
      {
        "label": "Fillings",
        "xmin": 151,
        "ymin": 103,
        "xmax": 170,
        "ymax": 147
      },
      {
        "label": "Fillings",
        "xmin": 317,
        "ymin": 106,
        "xmax": 338,
        "ymax": 149
      },
      {
        "label": "Fillings",
        "xmin": 338,
        "ymin": 105,
        "xmax": 363,
        "ymax": 151
      },
      {
        "label": "Implant",
        "xmin": 229,
        "ymin": 153,
        "xmax": 246,
        "ymax": 200
      },
      {
        "label": "Fillings",
        "xmin": 363,
        "ymin": 103,
        "xmax": 383,
        "ymax": 148
      }
    ]
  },
  {
    "id": "q3",
    "imageUrl": "/dataset/case3.jpg",
    "storagePath": "static:/dataset/case3.jpg",
    "questionText": "Identify the dominant radiographic finding in this dental image.",
    "choices": [
      "Cavity",
      "Fillings",
      "Implant",
      "Impacted Tooth"
    ],
    "aiPrediction": "Cavity",
    "aiConfidence": 0.96,
    "difficulty": "moderate",
    "datasetVersion": "dataset_v1",
    "annotations": [
      {
        "label": "Cavity",
        "xmin": 219,
        "ymin": 89,
        "xmax": 241,
        "ymax": 145
      },
      {
        "label": "Cavity",
        "xmin": 220,
        "ymin": 149,
        "xmax": 239,
        "ymax": 198
      }
    ]
  },
  {
    "id": "q4",
    "imageUrl": "/dataset/case4.jpg",
    "storagePath": "static:/dataset/case4.jpg",
    "questionText": "Identify the dominant radiographic finding in this dental image.",
    "choices": [
      "Cavity",
      "Fillings",
      "Implant",
      "Impacted Tooth"
    ],
    "aiPrediction": "Implant",
    "aiConfidence": 0.97,
    "difficulty": "easy",
    "datasetVersion": "dataset_v1",
    "annotations": [
      {
        "label": "Implant",
        "xmin": 163,
        "ymin": 124,
        "xmax": 196,
        "ymax": 173
      },
      {
        "label": "Implant",
        "xmin": 333,
        "ymin": 127,
        "xmax": 351,
        "ymax": 169
      },
      {
        "label": "Implant",
        "xmin": 310,
        "ymin": 166,
        "xmax": 322,
        "ymax": 212
      },
      {
        "label": "Cavity",
        "xmin": 319,
        "ymin": 129,
        "xmax": 332,
        "ymax": 161
      },
      {
        "label": "Cavity",
        "xmin": 212,
        "ymin": 112,
        "xmax": 237,
        "ymax": 161
      }
    ]
  },
  {
    "id": "q5",
    "imageUrl": "/dataset/case5.jpg",
    "storagePath": "static:/dataset/case5.jpg",
    "questionText": "Identify the dominant radiographic finding in this dental image.",
    "choices": [
      "Cavity",
      "Fillings",
      "Implant",
      "Impacted Tooth"
    ],
    "aiPrediction": "Fillings",
    "aiConfidence": 0.98,
    "difficulty": "moderate",
    "datasetVersion": "dataset_v1",
    "annotations": [
      {
        "label": "Fillings",
        "xmin": 98,
        "ymin": 132,
        "xmax": 137,
        "ymax": 178
      },
      {
        "label": "Fillings",
        "xmin": 126,
        "ymin": 136,
        "xmax": 170,
        "ymax": 182
      },
      {
        "label": "Fillings",
        "xmin": 96,
        "ymin": 87,
        "xmax": 128,
        "ymax": 134
      },
      {
        "label": "Fillings",
        "xmin": 153,
        "ymin": 91,
        "xmax": 173,
        "ymax": 137
      },
      {
        "label": "Fillings",
        "xmin": 184,
        "ymin": 136,
        "xmax": 204,
        "ymax": 182
      },
      {
        "label": "Fillings",
        "xmin": 320,
        "ymin": 81,
        "xmax": 337,
        "ymax": 132
      },
      {
        "label": "Fillings",
        "xmin": 338,
        "ymin": 80,
        "xmax": 353,
        "ymax": 132
      },
      {
        "label": "Fillings",
        "xmin": 369,
        "ymin": 127,
        "xmax": 406,
        "ymax": 171
      }
    ]
  },
  {
    "id": "q6",
    "imageUrl": "/dataset/case6.jpg",
    "storagePath": "static:/dataset/case6.jpg",
    "questionText": "Identify the dominant radiographic finding in this dental image.",
    "choices": [
      "Cavity",
      "Fillings",
      "Implant",
      "Impacted Tooth"
    ],
    "aiPrediction": "Fillings",
    "aiConfidence": 0.94,
    "difficulty": "hard",
    "datasetVersion": "dataset_v1",
    "annotations": [
      {
        "label": "Implant",
        "xmin": 128,
        "ymin": 125,
        "xmax": 178,
        "ymax": 178
      },
      {
        "label": "Cavity",
        "xmin": 109,
        "ymin": 121,
        "xmax": 145,
        "ymax": 157
      },
      {
        "label": "Implant",
        "xmin": 326,
        "ymin": 68,
        "xmax": 347,
        "ymax": 125
      },
      {
        "label": "Fillings",
        "xmin": 348,
        "ymin": 71,
        "xmax": 378,
        "ymax": 127
      },
      {
        "label": "Fillings",
        "xmin": 215,
        "ymin": 68,
        "xmax": 235,
        "ymax": 123
      },
      {
        "label": "Fillings",
        "xmin": 151,
        "ymin": 64,
        "xmax": 180,
        "ymax": 121
      },
      {
        "label": "Fillings",
        "xmin": 181,
        "ymin": 85,
        "xmax": 200,
        "ymax": 119
      },
      {
        "label": "Fillings",
        "xmin": 200,
        "ymin": 99,
        "xmax": 215,
        "ymax": 120
      },
      {
        "label": "Fillings",
        "xmin": 185,
        "ymin": 129,
        "xmax": 208,
        "ymax": 173
      },
      {
        "label": "Fillings",
        "xmin": 124,
        "ymin": 67,
        "xmax": 151,
        "ymax": 121
      },
      {
        "label": "Implant",
        "xmin": 300,
        "ymin": 64,
        "xmax": 316,
        "ymax": 122
      },
      {
        "label": "Fillings",
        "xmin": 378,
        "ymin": 86,
        "xmax": 396,
        "ymax": 121
      }
    ]
  },
  {
    "id": "q7",
    "imageUrl": "/dataset/case7.jpg",
    "storagePath": "static:/dataset/case7.jpg",
    "questionText": "Identify the dominant radiographic finding in this dental image.",
    "choices": [
      "Cavity",
      "Fillings",
      "Implant",
      "Impacted Tooth"
    ],
    "aiPrediction": "Impacted Tooth",
    "aiConfidence": 0.95,
    "difficulty": "moderate",
    "datasetVersion": "dataset_v1",
    "annotations": [
      {
        "label": "Impacted Tooth",
        "xmin": 102,
        "ymin": 133,
        "xmax": 135,
        "ymax": 160
      },
      {
        "label": "Cavity",
        "xmin": 346,
        "ymin": 135,
        "xmax": 375,
        "ymax": 184
      },
      {
        "label": "Impacted Tooth",
        "xmin": 117,
        "ymin": 79,
        "xmax": 139,
        "ymax": 118
      },
      {
        "label": "Impacted Tooth",
        "xmin": 367,
        "ymin": 77,
        "xmax": 389,
        "ymax": 116
      }
    ]
  },
  {
    "id": "q8",
    "imageUrl": "/dataset/case8.jpg",
    "storagePath": "static:/dataset/case8.jpg",
    "questionText": "Identify the dominant radiographic finding in this dental image.",
    "choices": [
      "Cavity",
      "Fillings",
      "Implant",
      "Impacted Tooth"
    ],
    "aiPrediction": "Fillings",
    "aiConfidence": 0.96,
    "difficulty": "easy",
    "datasetVersion": "dataset_v1",
    "annotations": [
      {
        "label": "Fillings",
        "xmin": 142,
        "ymin": 131,
        "xmax": 177,
        "ymax": 183
      },
      {
        "label": "Implant",
        "xmin": 201,
        "ymin": 143,
        "xmax": 227,
        "ymax": 197
      },
      {
        "label": "Fillings",
        "xmin": 305,
        "ymin": 138,
        "xmax": 323,
        "ymax": 190
      },
      {
        "label": "Fillings",
        "xmin": 290,
        "ymin": 68,
        "xmax": 316,
        "ymax": 123
      },
      {
        "label": "Fillings",
        "xmin": 326,
        "ymin": 73,
        "xmax": 359,
        "ymax": 121
      },
      {
        "label": "Fillings",
        "xmin": 160,
        "ymin": 68,
        "xmax": 189,
        "ymax": 112
      },
      {
        "label": "Fillings",
        "xmin": 136,
        "ymin": 69,
        "xmax": 162,
        "ymax": 112
      },
      {
        "label": "Fillings",
        "xmin": 289,
        "ymin": 140,
        "xmax": 305,
        "ymax": 194
      },
      {
        "label": "Impacted Tooth",
        "xmin": 77,
        "ymin": 135,
        "xmax": 118,
        "ymax": 171
      }
    ]
  },
  {
    "id": "q9",
    "imageUrl": "/dataset/case9.jpg",
    "storagePath": "static:/dataset/case9.jpg",
    "questionText": "Identify the dominant radiographic finding in this dental image.",
    "choices": [
      "Cavity",
      "Fillings",
      "Implant",
      "Impacted Tooth"
    ],
    "aiPrediction": "Fillings",
    "aiConfidence": 0.97,
    "difficulty": "moderate",
    "datasetVersion": "dataset_v1",
    "annotations": [
      {
        "label": "Fillings",
        "xmin": 195,
        "ymin": 78,
        "xmax": 213,
        "ymax": 127
      },
      {
        "label": "Impacted Tooth",
        "xmin": 96,
        "ymin": 116,
        "xmax": 142,
        "ymax": 159
      },
      {
        "label": "Fillings",
        "xmin": 129,
        "ymin": 126,
        "xmax": 169,
        "ymax": 173
      },
      {
        "label": "Fillings",
        "xmin": 188,
        "ymin": 135,
        "xmax": 208,
        "ymax": 171
      },
      {
        "label": "Fillings",
        "xmin": 316,
        "ymin": 79,
        "xmax": 335,
        "ymax": 123
      },
      {
        "label": "Fillings",
        "xmin": 333,
        "ymin": 79,
        "xmax": 358,
        "ymax": 127
      },
      {
        "label": "Fillings",
        "xmin": 301,
        "ymin": 135,
        "xmax": 320,
        "ymax": 175
      },
      {
        "label": "Fillings",
        "xmin": 154,
        "ymin": 75,
        "xmax": 180,
        "ymax": 122
      },
      {
        "label": "Fillings",
        "xmin": 355,
        "ymin": 82,
        "xmax": 380,
        "ymax": 126
      },
      {
        "label": "Fillings",
        "xmin": 301,
        "ymin": 78,
        "xmax": 318,
        "ymax": 125
      }
    ]
  },
  {
    "id": "q10",
    "imageUrl": "/dataset/case10.jpg",
    "storagePath": "static:/dataset/case10.jpg",
    "questionText": "Identify the dominant radiographic finding in this dental image.",
    "choices": [
      "Cavity",
      "Fillings",
      "Implant",
      "Impacted Tooth"
    ],
    "aiPrediction": "Fillings",
    "aiConfidence": 0.98,
    "difficulty": "hard",
    "datasetVersion": "dataset_v1",
    "annotations": [
      {
        "label": "Implant",
        "xmin": 304,
        "ymin": 91,
        "xmax": 323,
        "ymax": 142
      },
      {
        "label": "Fillings",
        "xmin": 143,
        "ymin": 160,
        "xmax": 169,
        "ymax": 201
      },
      {
        "label": "Fillings",
        "xmin": 139,
        "ymin": 115,
        "xmax": 164,
        "ymax": 153
      },
      {
        "label": "Fillings",
        "xmin": 159,
        "ymin": 115,
        "xmax": 183,
        "ymax": 154
      },
      {
        "label": "Fillings",
        "xmin": 171,
        "ymin": 158,
        "xmax": 191,
        "ymax": 201
      },
      {
        "label": "Fillings",
        "xmin": 315,
        "ymin": 149,
        "xmax": 343,
        "ymax": 188
      },
      {
        "label": "Fillings",
        "xmin": 189,
        "ymin": 157,
        "xmax": 210,
        "ymax": 178
      },
      {
        "label": "Fillings",
        "xmin": 303,
        "ymin": 151,
        "xmax": 316,
        "ymax": 168
      },
      {
        "label": "Fillings",
        "xmin": 288,
        "ymin": 152,
        "xmax": 302,
        "ymax": 195
      },
      {
        "label": "Fillings",
        "xmin": 209,
        "ymin": 154,
        "xmax": 226,
        "ymax": 203
      },
      {
        "label": "Fillings",
        "xmin": 180,
        "ymin": 113,
        "xmax": 197,
        "ymax": 153
      },
      {
        "label": "Implant",
        "xmin": 264,
        "ymin": 150,
        "xmax": 275,
        "ymax": 201
      }
    ]
  },
  {
    "id": "q11",
    "imageUrl": "/dataset/case11.jpg",
    "storagePath": "static:/dataset/case11.jpg",
    "questionText": "Identify the dominant radiographic finding in this dental image.",
    "choices": [
      "Cavity",
      "Fillings",
      "Implant",
      "Impacted Tooth"
    ],
    "aiPrediction": "Implant",
    "aiConfidence": 0.94,
    "difficulty": "hard",
    "datasetVersion": "dataset_v1",
    "annotations": [
      {
        "label": "Implant",
        "xmin": 319,
        "ymin": 87,
        "xmax": 341,
        "ymax": 140
      },
      {
        "label": "Implant",
        "xmin": 309,
        "ymin": 88,
        "xmax": 323,
        "ymax": 141
      },
      {
        "label": "Implant",
        "xmin": 295,
        "ymin": 89,
        "xmax": 309,
        "ymax": 142
      },
      {
        "label": "Implant",
        "xmin": 280,
        "ymin": 95,
        "xmax": 295,
        "ymax": 145
      },
      {
        "label": "Implant",
        "xmin": 316,
        "ymin": 146,
        "xmax": 345,
        "ymax": 188
      },
      {
        "label": "Implant",
        "xmin": 303,
        "ymin": 147,
        "xmax": 317,
        "ymax": 190
      },
      {
        "label": "Implant",
        "xmin": 144,
        "ymin": 148,
        "xmax": 176,
        "ymax": 185
      },
      {
        "label": "Implant",
        "xmin": 170,
        "ymin": 88,
        "xmax": 193,
        "ymax": 143
      },
      {
        "label": "Implant",
        "xmin": 190,
        "ymin": 88,
        "xmax": 208,
        "ymax": 142
      },
      {
        "label": "Fillings",
        "xmin": 202,
        "ymin": 151,
        "xmax": 217,
        "ymax": 192
      },
      {
        "label": "Fillings",
        "xmin": 176,
        "ymin": 151,
        "xmax": 190,
        "ymax": 189
      },
      {
        "label": "Implant",
        "xmin": 188,
        "ymin": 151,
        "xmax": 202,
        "ymax": 193
      },
      {
        "label": "Implant",
        "xmin": 208,
        "ymin": 97,
        "xmax": 222,
        "ymax": 145
      }
    ]
  },
  {
    "id": "q12",
    "imageUrl": "/dataset/case12.jpg",
    "storagePath": "static:/dataset/case12.jpg",
    "questionText": "Identify the dominant radiographic finding in this dental image.",
    "choices": [
      "Cavity",
      "Fillings",
      "Implant",
      "Impacted Tooth"
    ],
    "aiPrediction": "Fillings",
    "aiConfidence": 0.95,
    "difficulty": "hard",
    "datasetVersion": "dataset_v1",
    "annotations": [
      {
        "label": "Fillings",
        "xmin": 355,
        "ymin": 138,
        "xmax": 388,
        "ymax": 178
      },
      {
        "label": "Fillings",
        "xmin": 331,
        "ymin": 145,
        "xmax": 365,
        "ymax": 187
      },
      {
        "label": "Fillings",
        "xmin": 145,
        "ymin": 100,
        "xmax": 171,
        "ymax": 143
      },
      {
        "label": "Fillings",
        "xmin": 172,
        "ymin": 152,
        "xmax": 207,
        "ymax": 198
      },
      {
        "label": "Fillings",
        "xmin": 169,
        "ymin": 99,
        "xmax": 199,
        "ymax": 142
      },
      {
        "label": "Implant",
        "xmin": 204,
        "ymin": 155,
        "xmax": 220,
        "ymax": 190
      },
      {
        "label": "Fillings",
        "xmin": 337,
        "ymin": 93,
        "xmax": 361,
        "ymax": 135
      },
      {
        "label": "Fillings",
        "xmin": 355,
        "ymin": 87,
        "xmax": 385,
        "ymax": 131
      },
      {
        "label": "Fillings",
        "xmin": 319,
        "ymin": 97,
        "xmax": 340,
        "ymax": 137
      },
      {
        "label": "Fillings",
        "xmin": 218,
        "ymin": 150,
        "xmax": 235,
        "ymax": 203
      },
      {
        "label": "Fillings",
        "xmin": 307,
        "ymin": 151,
        "xmax": 332,
        "ymax": 199
      }
    ]
  },
  {
    "id": "q13",
    "imageUrl": "/dataset/case13.jpg",
    "storagePath": "static:/dataset/case13.jpg",
    "questionText": "Identify the dominant radiographic finding in this dental image.",
    "choices": [
      "Cavity",
      "Fillings",
      "Implant",
      "Impacted Tooth"
    ],
    "aiPrediction": "Fillings",
    "aiConfidence": 0.96,
    "difficulty": "moderate",
    "datasetVersion": "dataset_v1",
    "annotations": [
      {
        "label": "Fillings",
        "xmin": 338,
        "ymin": 147,
        "xmax": 368,
        "ymax": 193
      },
      {
        "label": "Fillings",
        "xmin": 311,
        "ymin": 151,
        "xmax": 346,
        "ymax": 198
      }
    ]
  },
  {
    "id": "q14",
    "imageUrl": "/dataset/case14.jpg",
    "storagePath": "static:/dataset/case14.jpg",
    "questionText": "Identify the dominant radiographic finding in this dental image.",
    "choices": [
      "Cavity",
      "Fillings",
      "Implant",
      "Impacted Tooth"
    ],
    "aiPrediction": "Fillings",
    "aiConfidence": 0.97,
    "difficulty": "easy",
    "datasetVersion": "dataset_v1",
    "annotations": [
      {
        "label": "Fillings",
        "xmin": 169,
        "ymin": 138,
        "xmax": 197,
        "ymax": 174
      },
      {
        "label": "Fillings",
        "xmin": 192,
        "ymin": 143,
        "xmax": 213,
        "ymax": 176
      },
      {
        "label": "Fillings",
        "xmin": 188,
        "ymin": 88,
        "xmax": 203,
        "ymax": 129
      },
      {
        "label": "Fillings",
        "xmin": 205,
        "ymin": 89,
        "xmax": 217,
        "ymax": 132
      },
      {
        "label": "Fillings",
        "xmin": 168,
        "ymin": 85,
        "xmax": 190,
        "ymax": 125
      },
      {
        "label": "Fillings",
        "xmin": 312,
        "ymin": 136,
        "xmax": 344,
        "ymax": 174
      },
      {
        "label": "Fillings",
        "xmin": 296,
        "ymin": 143,
        "xmax": 318,
        "ymax": 172
      },
      {
        "label": "Fillings",
        "xmin": 321,
        "ymin": 87,
        "xmax": 343,
        "ymax": 126
      }
    ]
  },
  {
    "id": "q15",
    "imageUrl": "/dataset/case15.jpg",
    "storagePath": "static:/dataset/case15.jpg",
    "questionText": "Identify the dominant radiographic finding in this dental image.",
    "choices": [
      "Cavity",
      "Fillings",
      "Implant",
      "Impacted Tooth"
    ],
    "aiPrediction": "Implant",
    "aiConfidence": 0.98,
    "difficulty": "moderate",
    "datasetVersion": "dataset_v1",
    "annotations": [
      {
        "label": "Implant",
        "xmin": 220,
        "ymin": 66,
        "xmax": 237,
        "ymax": 121
      }
    ]
  },
  {
    "id": "q16",
    "imageUrl": "/dataset/case16.jpg",
    "storagePath": "static:/dataset/case16.jpg",
    "questionText": "Identify the dominant radiographic finding in this dental image.",
    "choices": [
      "Cavity",
      "Fillings",
      "Implant",
      "Impacted Tooth"
    ],
    "aiPrediction": "Impacted Tooth",
    "aiConfidence": 0.94,
    "difficulty": "hard",
    "datasetVersion": "dataset_v1",
    "annotations": [
      {
        "label": "Impacted Tooth",
        "xmin": 373,
        "ymin": 141,
        "xmax": 407,
        "ymax": 174
      },
      {
        "label": "Impacted Tooth",
        "xmin": 113,
        "ymin": 142,
        "xmax": 146,
        "ymax": 177
      },
      {
        "label": "Impacted Tooth",
        "xmin": 130,
        "ymin": 83,
        "xmax": 158,
        "ymax": 116
      }
    ]
  },
  {
    "id": "q17",
    "imageUrl": "/dataset/case17.jpg",
    "storagePath": "static:/dataset/case17.jpg",
    "questionText": "Identify the dominant radiographic finding in this dental image.",
    "choices": [
      "Cavity",
      "Fillings",
      "Implant",
      "Impacted Tooth"
    ],
    "aiPrediction": "Cavity",
    "aiConfidence": 0.95,
    "difficulty": "moderate",
    "datasetVersion": "dataset_v1",
    "annotations": [
      {
        "label": "Cavity",
        "xmin": 84,
        "ymin": 99,
        "xmax": 120,
        "ymax": 151
      },
      {
        "label": "Cavity",
        "xmin": 329,
        "ymin": 112,
        "xmax": 365,
        "ymax": 177
      }
    ]
  },
  {
    "id": "q18",
    "imageUrl": "/dataset/case18.jpg",
    "storagePath": "static:/dataset/case18.jpg",
    "questionText": "Identify the dominant radiographic finding in this dental image.",
    "choices": [
      "Cavity",
      "Fillings",
      "Implant",
      "Impacted Tooth"
    ],
    "aiPrediction": "Fillings",
    "aiConfidence": 0.96,
    "difficulty": "easy",
    "datasetVersion": "dataset_v1",
    "annotations": [
      {
        "label": "Fillings",
        "xmin": 170,
        "ymin": 161,
        "xmax": 198,
        "ymax": 210
      },
      {
        "label": "Fillings",
        "xmin": 319,
        "ymin": 163,
        "xmax": 346,
        "ymax": 211
      },
      {
        "label": "Fillings",
        "xmin": 346,
        "ymin": 116,
        "xmax": 366,
        "ymax": 156
      },
      {
        "label": "Fillings",
        "xmin": 195,
        "ymin": 164,
        "xmax": 220,
        "ymax": 208
      },
      {
        "label": "Fillings",
        "xmin": 341,
        "ymin": 160,
        "xmax": 362,
        "ymax": 199
      },
      {
        "label": "Fillings",
        "xmin": 220,
        "ymin": 163,
        "xmax": 230,
        "ymax": 200
      }
    ]
  },
  {
    "id": "q19",
    "imageUrl": "/dataset/case19.jpg",
    "storagePath": "static:/dataset/case19.jpg",
    "questionText": "Identify the dominant radiographic finding in this dental image.",
    "choices": [
      "Cavity",
      "Fillings",
      "Implant",
      "Impacted Tooth"
    ],
    "aiPrediction": "Fillings",
    "aiConfidence": 0.97,
    "difficulty": "moderate",
    "datasetVersion": "dataset_v1",
    "annotations": [
      {
        "label": "Fillings",
        "xmin": 315,
        "ymin": 119,
        "xmax": 338,
        "ymax": 164
      },
      {
        "label": "Implant",
        "xmin": 202,
        "ymin": 158,
        "xmax": 217,
        "ymax": 204
      }
    ]
  },
  {
    "id": "q20",
    "imageUrl": "/dataset/case20.jpg",
    "storagePath": "static:/dataset/case20.jpg",
    "questionText": "Identify the dominant radiographic finding in this dental image.",
    "choices": [
      "Cavity",
      "Fillings",
      "Implant",
      "Impacted Tooth"
    ],
    "aiPrediction": "Fillings",
    "aiConfidence": 0.98,
    "difficulty": "hard",
    "datasetVersion": "dataset_v1",
    "annotations": [
      {
        "label": "Implant",
        "xmin": 330,
        "ymin": 156,
        "xmax": 352,
        "ymax": 207
      },
      {
        "label": "Implant",
        "xmin": 310,
        "ymin": 153,
        "xmax": 331,
        "ymax": 207
      },
      {
        "label": "Implant",
        "xmin": 291,
        "ymin": 151,
        "xmax": 312,
        "ymax": 208
      },
      {
        "label": "Implant",
        "xmin": 184,
        "ymin": 157,
        "xmax": 207,
        "ymax": 208
      },
      {
        "label": "Fillings",
        "xmin": 154,
        "ymin": 157,
        "xmax": 182,
        "ymax": 195
      },
      {
        "label": "Fillings",
        "xmin": 152,
        "ymin": 117,
        "xmax": 177,
        "ymax": 150
      },
      {
        "label": "Fillings",
        "xmin": 345,
        "ymin": 111,
        "xmax": 366,
        "ymax": 150
      },
      {
        "label": "Fillings",
        "xmin": 323,
        "ymin": 111,
        "xmax": 344,
        "ymax": 148
      },
      {
        "label": "Fillings",
        "xmin": 308,
        "ymin": 112,
        "xmax": 324,
        "ymax": 146
      },
      {
        "label": "Fillings",
        "xmin": 296,
        "ymin": 103,
        "xmax": 311,
        "ymax": 142
      },
      {
        "label": "Implant",
        "xmin": 176,
        "ymin": 112,
        "xmax": 197,
        "ymax": 151
      },
      {
        "label": "Implant",
        "xmin": 196,
        "ymin": 108,
        "xmax": 211,
        "ymax": 151
      },
      {
        "label": "Fillings",
        "xmin": 208,
        "ymin": 107,
        "xmax": 224,
        "ymax": 147
      },
      {
        "label": "Fillings",
        "xmin": 368,
        "ymin": 111,
        "xmax": 387,
        "ymax": 147
      }
    ]
  }
];
