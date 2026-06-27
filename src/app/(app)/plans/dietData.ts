export interface Recipe {
  type: string;
  name: string;
  calories: number;
  time: string;
  tags: string[];
  image: string;
  ingredients: string[];
  instructions: string[];
  benefit?: string;
}

export interface DailyPlan {
  day: number;
  theme: string;
  workout: {
    title: string;
    type: string;
    duration: string;
    intensity: string;
    calories: number;
    description: string;
    image: string;
    exercises: { name: string; sets: number; reps: string; duration?: string; image?: string; video?: string; instruction?: string }[];
  };
  meals: {
    omnivore: Recipe[];
    vegetarian: Recipe[];
  };
}

// ─── Region Specific Data Banks ────────────────────────────────────────────────

const regionalData: Record<string, {
  themes: string[];
  omnivore: { breakfasts: any[], lunches: any[], dinners: any[] };
  vegetarian: { breakfasts: any[], lunches: any[], dinners: any[] };
}> = {
  global: {
    themes: [
      "Mediterranean Metabolic Reset",
      "Low-Carb Fat Adaptation",
      "High-Fiber Gut Health",
      "Anti-Inflammatory Focus",
      "Insulin Sensitivity Boost",
      "Lean Protein & Greens",
      "Complex Carb Cycling"
    ],
    omnivore: {
      breakfasts: [
        { 
          name: "Avocado & Spinach Sourdough Toast", 
          cals: 340, time: "10 min", 
          tags: ["Low GI", "Healthy Fats"], 
          img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400&fit=crop", 
          inc: ["1 slice authentic sourdough bread", "1/2 avocado, mashed", "1 cup baby spinach", "1 free-range egg, poached", "Pinch of red pepper flakes"],
          benefit: "Sourdough undergoes fermentation, breaking down starches and resulting in a lower glycemic index than regular bread."
        },
        { 
          name: "Savory Mediterranean Egg Scramble", 
          cals: 350, time: "15 min", 
          tags: ["High Protein", "Keto"], 
          img: "https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=400&fit=crop", 
          inc: ["3 whole eggs", "1/4 cup chopped tomatoes", "1/4 cup kalamata olives", "1 tbsp feta cheese", "1 cup chopped spinach", "1 tsp extra virgin olive oil"],
          benefit: "A high-protein breakfast essentially 'turns off' the hunger hormone ghrelin for the rest of the day."
        }
      ],
      lunches: [
        { 
          name: "Grilled Wild Salmon & Kale Bowl", 
          cals: 450, time: "20 min", 
          tags: ["Omega-3", "Iron Rich"], 
          img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=400&fit=crop", 
          inc: ["5 oz wild-caught salmon", "2 cups massaged kale", "1/4 cup quinoa", "1/4 cup cherry tomatoes", "Olive oil and lemon dressing"],
          benefit: "Wild salmon is rich in EPA and DHA, Omega-3 fatty acids that reduce systemic inflammation."
        },
        { 
          name: "Chicken Apple Walnut Salad", 
          cals: 430, time: "15 min", 
          tags: ["High Protein", "Crunchy"], 
          img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&fit=crop", 
          inc: ["4 oz grilled chicken breast, diced", "1/2 green apple, diced", "2 tbsp crushed walnuts", "1 tbsp Greek yogurt (in place of mayo)", "Served over mixed greens"],
          benefit: "By using Greek yogurt instead of mayonnaise, we increase the protein content and reduce saturated fats."
        }
      ],
      dinners: [
        { 
          name: "Grass-Fed Steak with Asparagus", 
          cals: 520, time: "25 min", 
          tags: ["Iron Rich", "Keto"], 
          img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=400&fit=crop", 
          inc: ["6 oz grass-fed flank or sirloin steak", "1 bunch asparagus spears", "1 clove crushed garlic", "1 tbsp olive oil", "Sea salt and black pepper"],
          benefit: "Grass-fed beef contains conjugated linoleic acid (CLA) and a better Omega-3 to Omega-6 ratio than grain-fed beef."
        },
        { 
          name: "Lemon Herb Mahi Mahi with Quinoa", 
          cals: 460, time: "25 min", 
          tags: ["Pescatarian", "Nutrient Dense"], 
          img: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=400&fit=crop", 
          inc: ["6 oz Mahi Mahi fillet", "1/2 cup cooked quinoa", "1 cup steamed green beans", "2 tbsp lemon juice", "Fresh dill and parsley"],
          benefit: "Fish protein is highly insulinogenic, meaning it signals the muscles to take up circulating glucose effectively without requiring excessive amounts of insulin."
        }
      ]
    },
    vegetarian: {
      breakfasts: [
        { 
          name: "Tofu Scramble with Turmeric & Spinach", 
          cals: 290, time: "15 min", 
          tags: ["Vegan", "Anti-Inflammatory"], 
          img: "https://images.unsplash.com/photo-1546069901-d5bfd20bf63c?q=80&w=400&fit=crop", 
          inc: ["1/2 block extra firm tofu, crumbled", "1 tbsp nutritional yeast", "1/2 tsp turmeric powder", "1 cup baby spinach", "1 tsp olive oil"],
          benefit: "Turmeric contains curcumin, a potent anti-inflammatory compound that directly improves beta-cell function in the pancreas."
        },
        { 
          name: "Chia Seed & Wild Blueberry Pudding", 
          cals: 280, time: "5 min", 
          tags: ["High Fiber", "Omega-3"], 
          img: "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?q=80&w=400&fit=crop", 
          inc: ["3 tbsp chia seeds", "1 cup unsweetened almond milk", "1/2 cup wild blueberries", "1 tbsp crushed walnuts", "Dash of Ceylon cinnamon"],
          benefit: "Chia seeds expand and form a gel in your stomach, slowing the absorption of glucose into the bloodstream."
        }
      ],
      lunches: [
        { 
          name: "Spicy Edamame & Peanut Soba Noodle Salad", 
          cals: 420, time: "20 min", 
          tags: ["Vegan", "Energy"], 
          img: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=400&fit=crop", 
          inc: ["2 oz 100% buckwheat soba noodles", "1/2 cup shelled edamame", "1/4 cup shredded carrots", "1 tbsp all-natural peanut butter", "1 tsp sriracha and lime juice"],
          benefit: "Proper 100% buckwheat soba noodles are gluten-free and have a much lower glycemic load than wheat pasta."
        },
        { 
          name: "Warm Quinoa & Roasted Root Vegetable Bowl", 
          cals: 400, time: "30 min", 
          tags: ["Complex Carbs", "Hearty"], 
          img: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=400&fit=crop", 
          inc: ["1/2 cup cooked quinoa", "1/2 cup roasted sweet potatoes", "1/4 cup roasted beets", "2 cups arugula", "Tahini lemon dressing"],
          benefit: "Root vegetables like sweet potatoes and beets contain fiber and nitrates that improve blood flow and metabolic function."
        }
      ],
      dinners: [
        { 
          name: "Tempeh & Broccoli Miso Stir-fry", 
          cals: 420, time: "25 min", 
          tags: ["Vegan", "Probiotic"], 
          img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=400&fit=crop", 
          inc: ["4 oz sliced tempeh", "2 cups broccoli florets", "1 tbsp miso paste", "1 tsp ginger paste", "1/2 cup brown rice"],
          benefit: "Tempeh is fermented soybeans, making its proteins and minerals highly bioavailable compared to unfermented soy."
        },
        { 
          name: "Zucchini Lasagna Roll-ups", 
          cals: 360, time: "40 min", 
          tags: ["Vegetarian", "Low Carb"], 
          img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=400&fit=crop", 
          inc: ["2 large zucchinis, sliced thin lengthwise", "1/2 cup part-skim ricotta", "1/4 cup mozzarella", "1/2 cup marinara sauce", "Fresh basil"],
          benefit: "By using zucchini slices instead of pasta sheets, this dish drastically cuts down on simple carbohydrates."
        }
      ]
    }
  },
  north_indian: {
    themes: [
      "Low-GI Punjabi Reset",
      "Fiber-Rich Awadhi",
      "Metabolic Tandoori",
      "Dal Protein Power",
      "Insulin-Friendly Sabzi"
    ],
    omnivore: {
      breakfasts: [
        { 
          name: "Masala Egg Bhurji & Multigrain Roti", 
          cals: 380, time: "15 min", 
          tags: ["High Protein", "Indian"], 
          img: "https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=400&fit=crop", 
          inc: ["3 eggs, scrambled with onions, tomatoes, green chilies", "1 multigrain or jawar roti", "1 tsp ghee"],
          benefit: "Eggs provide excellent protein and fat to stabilize morning blood sugar. Using jawar or multigrain roti prevents the rapid insulin spike associated with refined wheat."
        },
        { 
          name: "Chicken Tikka Omelette", 
          cals: 410, time: "20 min", 
          tags: ["High Protein", "Keto"], 
          img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400&fit=crop", 
          inc: ["3 whole eggs", "50g leftover chicken tikka", "Handful of coriander", "Pinch of garam masala"],
          benefit: "A very low-carbohydrate breakfast that keeps you full for hours and prevents any morning glucose excursions."
        }
      ],
      lunches: [
        { 
          name: "Grilled Chicken Tikka & Cucumber Salad", 
          cals: 450, time: "25 min", 
          tags: ["High Protein", "Low Carb"], 
          img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&fit=crop", 
          inc: ["150g chicken breast marinated in yogurt and tikka spices", "1 cup cucumber & onion salad with lemon juice", "1/2 cup mint yogurt dip"],
          benefit: "Chicken provides highly satiating protein. The cucumber salad offers hydration and fiber, while the lemon juice helps blunt any minor glucose response."
        },
        { 
          name: "Fish Curry with Brown Rice", 
          cals: 480, time: "30 min", 
          tags: ["Omega-3", "Complex Carbs"], 
          img: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=400&fit=crop", 
          inc: ["150g white fish cooked in tomato-mustard curry", "1/2 cup cooked brown rice", "Side of sauteed spinach (palak)"],
          benefit: "Mustard oil and spices improve insulin sensitivity. Brown rice offers a much lower glycemic index than white basmati rice."
        }
      ],
      dinners: [
        { 
          name: "Tandoori Chicken & Roasted Veggies", 
          cals: 420, time: "35 min", 
          tags: ["Low Carb", "High Protein"], 
          img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=400&fit=crop", 
          inc: ["2 pieces tandoori chicken", "1 cup roasted cauliflower & bell peppers", "Mint chutney"],
          benefit: "Oven-roasted chicken and cruciferous vegetables like cauliflower are perfect for keeping overnight fasting blood sugar levels low and stable."
        },
        { 
          name: "Keema Matar (Minced Meat & Peas)", 
          cals: 460, time: "30 min", 
          tags: ["Iron Rich", "Comfort"], 
          img: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=400&fit=crop", 
          inc: ["150g lean mutton or chicken keema", "1/4 cup green peas", "1 small jawar or bajra roti", "Side salad"],
          benefit: "Lean minced meat paired with the resistant starch of jawar roti creates a slow-digesting, highly nutritious evening meal."
        }
      ]
    },
    vegetarian: {
      breakfasts: [
        { 
          name: "Moong Dal Chilla with Mint Chutney", 
          cals: 320, time: "15 min", 
          tags: ["High Protein", "Low GI"], 
          img: "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?q=80&w=400&fit=crop", 
          inc: ["2 chillas made from soaked green moong dal", "2 tbsp mint-coriander chutney", "1/4 cup grated paneer filling"],
          benefit: "Moong dal is packed with protein and fiber, ensuring a very slow rise in blood sugar compared to traditional wheat-based parathas."
        },
        { 
          name: "Vegetable Sprouts Poha", 
          cals: 290, time: "15 min", 
          tags: ["High Fiber", "Probiotic"], 
          img: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=400&fit=crop", 
          inc: ["1/2 cup flattened rice (poha)", "1/2 cup mixed sprouted moong", "Peanuts, curry leaves, mustard seeds", "Squeeze of lemon"],
          benefit: "Adding sprouts dramatically lowers the overall glycemic index of the poha and introduces gut-friendly enzymes."
        }
      ],
      lunches: [
        { 
          name: "Palak Paneer with Missi Roti", 
          cals: 440, time: "25 min", 
          tags: ["Calcium", "Fiber"], 
          img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&fit=crop", 
          inc: ["1 bowl spinach puree (palak)", "50g paneer cubes", "1 missi roti (besan + wheat blend)", "Cucumber raita"],
          benefit: "Spinach is rich in magnesium which aids in glucose metabolism. Missi roti adds chickpea flour (besan) which significantly lowers the carb impact."
        },
        { 
          name: "Rajma (Kidney Beans) & Quinoa", 
          cals: 410, time: "30 min", 
          tags: ["Complex Carbs", "Plant Protein"], 
          img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&fit=crop", 
          inc: ["1 bowl rajma cooked in tomato gravy", "1/2 cup cooked quinoa (substituting white rice)", "Side of onion rings with lemon"],
          benefit: "Kidney beans have one of the lowest glycemic indexes of all foods. Swapping rice for quinoa ensures you get complete protein without the glucose spike."
        }
      ],
      dinners: [
        { 
          name: "Lauki (Bottle Gourd) Sabzi & Dal Tadka", 
          cals: 350, time: "25 min", 
          tags: ["Light", "Digestion"], 
          img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=400&fit=crop", 
          inc: ["1 bowl bottle gourd dry sabzi", "1 small bowl yellow dal tadka", "1 thin bajra roti"],
          benefit: "Bottle gourd is nearly 96% water and very low in carbs. Combined with protein-rich dal, this is a perfect, light metabolic dinner."
        },
        { 
          name: "Tofu Bhurji & Mixed Veg Salad", 
          cals: 340, time: "20 min", 
          tags: ["Vegan", "Low Carb"], 
          img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=400&fit=crop", 
          inc: ["100g scrambled extra-firm tofu with Indian spices", "1 large bowl kachumber salad (cucumber, tomato, onion)", "1 tsp flax seeds"],
          benefit: "Tofu mimics the texture of paneer but with less saturated fat, providing steady amino acids for muscle repair overnight without impacting glucose."
        }
      ]
    }
  },
  south_indian: {
    themes: [
      "Low-GI Dravidian Reset",
      "Millets & Spices",
      "Coastal Metabolic Health",
      "Fermented Gut Power"
    ],
    omnivore: {
      breakfasts: [
        { 
          name: "Egg Appam & Chicken Stew", 
          cals: 420, time: "20 min", 
          tags: ["Balanced", "High Protein"], 
          img: "https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=400&fit=crop", 
          inc: ["2 fermented rice/coconut appams with an egg cooked in the center", "1/2 cup chicken & vegetable coconut milk stew"],
          benefit: "Fermentation lowers the GI of the appam batter. The coconut milk provides medium-chain triglycerides (MCTs) which provide immediate energy without needing insulin."
        },
        { 
          name: "Spicy Chettinad Chicken Omelette", 
          cals: 380, time: "15 min", 
          tags: ["High Protein", "Spicy"], 
          img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400&fit=crop", 
          inc: ["3 eggs", "50g minced chicken with Chettinad spices (black pepper, fennel)", "1 cup sautéed cabbage poriyal"],
          benefit: "Black pepper enhances nutrient absorption. This zero-carb breakfast ensures absolute glucose stability throughout the morning."
        }
      ],
      lunches: [
        { 
          name: "Kerala Fish Curry & Red Matta Rice", 
          cals: 450, time: "30 min", 
          tags: ["Omega-3", "Complex Carbs"], 
          img: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=400&fit=crop", 
          inc: ["150g Seer fish (Neymeen) or Sardines in tamarind coconut curry", "1/2 cup Kerala red matta rice", "Side of moru (buttermilk)"],
          benefit: "Matta rice retains its outer bran layer, making it far superior to polished white rice for glycemic control. Sardines are excellent for reducing triglycerides."
        },
        { 
          name: "Chicken Sukka & Quinoa Bisi Bele Bath", 
          cals: 470, time: "35 min", 
          tags: ["High Protein", "Fiber Rich"], 
          img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&fit=crop", 
          inc: ["100g dry roasted chicken sukka", "1/2 cup Bisi Bele Bath made with Quinoa instead of rice", "Cucumber pachadi"],
          benefit: "Substituting quinoa in traditional dishes maintains the authentic flavor profile while drastically cutting the glycemic load."
        }
      ],
      dinners: [
        { 
          name: "Grilled Fish Pollichathu", 
          cals: 390, time: "25 min", 
          tags: ["Low Carb", "Aromatic"], 
          img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=400&fit=crop", 
          inc: ["1 whole fish marinated and grilled in a banana leaf", "Side of avial (mixed vegetables in coconut)", "Small bowl of rasam"],
          benefit: "Cooking in banana leaves seals in moisture without needing excess oil. Rasam contains tamarind and black pepper which improve digestion and insulin sensitivity."
        },
        { 
          name: "Mutton Bone Broth & Cauliflower Rice", 
          cals: 410, time: "40 min", 
          tags: ["Collagen", "Keto"], 
          img: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=400&fit=crop", 
          inc: ["1 large bowl of spiced mutton bone soup (Nenju Elumbu Soup)", "1 cup cauliflower rice stir-fried with curry leaves"],
          benefit: "Bone broth is rich in collagen and amino acids like glycine, which has been shown to improve insulin secretion and reduce fasting glucose levels."
        }
      ]
    },
    vegetarian: {
      breakfasts: [
        { 
          name: "Ragi (Finger Millet) Dosa with Sambar", 
          cals: 310, time: "15 min", 
          tags: ["Calcium Rich", "Low GI"], 
          img: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=400&fit=crop", 
          inc: ["2 thin dosas made from ragi batter", "1 bowl vegetable sambar", "1 tbsp peanut/tomato chutney"],
          benefit: "Ragi is highly alkaline and has a very low glycemic index. It is exceptionally rich in calcium and polyphenols, making it a superfood for diabetes prevention."
        },
        { 
          name: "Oats Pesarattu (Green Gram Dosa)", 
          cals: 330, time: "15 min", 
          tags: ["High Protein", "Fiber"], 
          img: "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?q=80&w=400&fit=crop", 
          inc: ["2 pesarattu dosas made with whole green gram and oats", "Ginger chutney", "Small portion of upma inside (optional, use millet upma)"],
          benefit: "Green gram provides significant protein while oats add soluble fiber (beta-glucan), creating a perfect meal to blunt the morning cortisol-induced glucose spike."
        }
      ],
      lunches: [
        { 
          name: "Foxtail Millet Tamarind Rice & Sundal", 
          cals: 420, time: "25 min", 
          tags: ["Ancient Grains", "Plant Protein"], 
          img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&fit=crop", 
          inc: ["1/2 cup Pulihora made with foxtail millet", "1/2 cup chickpea sundal (stir-fried with coconut and curry leaves)", "Cucumber slices"],
          benefit: "Foxtail millet releases glucose steadily over several hours. Chickpea sundal provides crucial plant protein and fiber."
        },
        { 
          name: "Vegetable Kootu & Red Rice", 
          cals: 390, time: "30 min", 
          tags: ["Micronutrients", "Balanced"], 
          img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&fit=crop", 
          inc: ["1 bowl mixed vegetable kootu (lentils & veggies with coconut)", "1/2 cup Kerala red rice", "Moru (spiced buttermilk)"],
          benefit: "The combination of lentils, vegetables, and minimal complex carbs is the cornerstone of a metabolic-friendly South Indian diet."
        }
      ],
      dinners: [
        { 
          name: "Adai (Multi-Lentil Pancake) & Aviyal", 
          cals: 360, time: "20 min", 
          tags: ["High Protein", "Vegetarian"], 
          img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=400&fit=crop", 
          inc: ["1 medium Adai (made from toor, chana, urad dal)", "1 bowl Aviyal (mixed vegetables in coconut yogurt paste)", "Jaggery (skip for tight control)"],
          benefit: "Adai is incredibly rich in protein and fiber due to the multi-lentil base, ensuring almost zero rapid glucose absorption."
        },
        { 
          name: "Cauliflower Rice Curd 'Rice'", 
          cals: 280, time: "15 min", 
          tags: ["Probiotic", "Ultra Low Carb"], 
          img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=400&fit=crop", 
          inc: ["1 cup steamed cauliflower rice mixed with plain yogurt", "Tempering of mustard seeds, urad dal, curry leaves, and ginger", "Pomegranate arils"],
          benefit: "Provides the immense comfort of South Indian curd rice but with a fraction of the carbohydrates, perfect for a light, gut-healing dinner."
        }
      ]
    }
  }
};

const workoutTypes = [
  { title: "Metabolic Accelerator", type: "Full Body", intensity: "Medium" },
  { title: "Core & Stability", type: "Core", intensity: "Low" },
  { title: "HIIT Fat Burner", type: "Cardio", intensity: "High" },
  { title: "Upper Body Strength", type: "Strength", intensity: "Medium" },
  { title: "Active Mobility", type: "Recovery", intensity: "Low" }
];

const exercisesGen = [
  { name: "Jumping Jacks", sets: 3, reps: "45 sec", duration: "1.5 min", image: "https://cdn.pixabay.com/animation/2025/07/22/03/57/03-57-05-380_512.gif", instruction: "Good for vascular health." },
  { name: "Bodyweight Squats", sets: 3, reps: "15 reps", duration: "2 min", image: "https://upload.wikimedia.org/wikipedia/commons/d/df/Bodyweight_Squats.gif", instruction: "Engages large muscle groups to burn glycogen." },
  { name: "Push-ups", sets: 3, reps: "10-12 reps", duration: "2 min", image: "https://cdn.pixabay.com/animation/2025/08/09/09/04/09-04-54-470_512.gif", instruction: "Builds upper body strength." },
  { name: "Plank Hold", sets: 3, reps: "30-60 sec", duration: "3 min", image: "https://gymvisual.com/img/p/3/2/8/5/7/32857.gif", instruction: "Core stabilization." }
];

export function generateDietPlan(region: string = 'global'): DailyPlan[] {
  const data = regionalData[region] || regionalData['global'];
  
  return Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const wType = workoutTypes[day % workoutTypes.length];
    
    const bTemp = data.omnivore.breakfasts[day % data.omnivore.breakfasts.length];
    const lTemp = data.omnivore.lunches[day % data.omnivore.lunches.length];
    const dTemp = data.omnivore.dinners[day % data.omnivore.dinners.length];

    const vbTemp = data.vegetarian.breakfasts[day % data.vegetarian.breakfasts.length];
    const vlTemp = data.vegetarian.lunches[day % data.vegetarian.lunches.length];
    const vdTemp = data.vegetarian.dinners[day % data.vegetarian.dinners.length];

    return {
      day,
      theme: data.themes[day % data.themes.length],
      workout: {
        title: wType.title,
        type: wType.type,
        duration: day % 5 === 0 ? "15 Min" : "25 Min",
        intensity: day % 7 === 0 ? "Recovery" : wType.intensity,
        calories: Math.floor(Math.random() * 200) + 150,
        description: "Expert curated routine designed to maximize insulin sensitivity.",
        image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800&fit=crop",
        exercises: exercisesGen,
      },
      meals: {
        omnivore: [
          { type: "Breakfast", name: bTemp.name, calories: bTemp.cals, time: bTemp.time, tags: bTemp.tags, image: bTemp.img, ingredients: bTemp.inc, instructions: ["Gather all ingredients.", "Prepare according to standard methods.", "Serve fresh."], benefit: bTemp.benefit },
          { type: "Lunch", name: lTemp.name, calories: lTemp.cals, time: lTemp.time, tags: lTemp.tags, image: lTemp.img, ingredients: lTemp.inc, instructions: ["Pre-cook raw proteins if any.", "Assemble the salad or bowl.", "Top with healthy fats/dressings."], benefit: lTemp.benefit },
          { type: "Dinner", name: dTemp.name, calories: dTemp.cals, time: dTemp.time, tags: dTemp.tags, image: dTemp.img, ingredients: dTemp.inc, instructions: ["Preheat oven or pan.", "Cook protein thoroughly.", "Roast or sauté vegetables.", "Serve hot."], benefit: dTemp.benefit }
        ],
        vegetarian: [
          { type: "Breakfast", name: vbTemp.name, calories: vbTemp.cals, time: vbTemp.time, tags: vbTemp.tags, image: vbTemp.img, ingredients: vbTemp.inc, instructions: ["Gather all ingredients.", "Prepare according to standard methods.", "Serve fresh."], benefit: vbTemp.benefit },
          { type: "Lunch", name: vlTemp.name, calories: vlTemp.cals, time: vlTemp.time, tags: vlTemp.tags, image: vlTemp.img, ingredients: vlTemp.inc, instructions: ["Cook complex carbohydrates.", "Assemble the bowl.", "Top with plant proteins."], benefit: vlTemp.benefit },
          { type: "Dinner", name: vdTemp.name, calories: vdTemp.cals, time: vdTemp.time, tags: vdTemp.tags, image: vdTemp.img, ingredients: vdTemp.inc, instructions: ["Preheat oven or pan.", "Prepare plant proteins perfectly.", "Sauté or bake sides.", "Serve hot."], benefit: vdTemp.benefit }
        ]
      }
    };
  });
}

// Ensure backwards compatibility for now if anything imports dietData directly
export const dietData = generateDietPlan('global');
