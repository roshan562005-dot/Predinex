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

// Generate realistic-sounding, highly varied meal data for 30 days
export const dietData: DailyPlan[] = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const themes = [
    "Mediterranean Metabolic Reset",
    "Low-Carb Fat Adaptation",
    "High-Fiber Gut Health",
    "Anti-Inflammatory Focus",
    "Insulin Sensitivity Boost",
    "Lean Protein & Greens",
    "Complex Carb Cycling"
  ];

  /* 
    COMPREHENSIVE MEAL DATABASE 
    Clinically inspired meals to prevent pre-diabetes.
  */
  
  const breakfasts = [
    { 
      name: "Avocado & Spinach Sourdough Toast", 
      cals: 340, time: "10 min", 
      tags: ["Low GI", "Healthy Fats"], 
      img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=400&fit=crop", 
      inc: ["1 slice authentic sourdough bread", "1/2 avocado, mashed", "1 cup baby spinach", "1 free-range egg, poached", "Pinch of red pepper flakes"],
      benefit: "Sourdough undergoes fermentation, breaking down starches and resulting in a lower glycemic index than regular bread. Avocado provides monounsaturated fats that slow digestion, while the egg provides high-quality protein, preventing morning insulin spikes."
    },
    { 
      name: "Chia Seed & Wild Blueberry Pudding", 
      cals: 280, time: "5 min (Prep)", 
      tags: ["High Fiber", "Omega-3"], 
      img: "https://images.unsplash.com/photo-1495214783159-3503fd1b572d?q=80&w=400&fit=crop", 
      inc: ["3 tbsp chia seeds", "1 cup unsweetened almond milk", "1/2 cup wild blueberries", "1 tbsp crushed walnuts", "Dash of Ceylon cinnamon"],
      benefit: "Chia seeds expand and form a gel in your stomach, slowing the absorption of glucose into the bloodstream. Wild blueberries are packed with anthocyanins, antioxidants proven to improve insulin signaling at the cellular level."
    },
    { 
      name: "Savory Mediterranean Egg Scramble", 
      cals: 350, time: "15 min", 
      tags: ["High Protein", "Keto"], 
      img: "https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=400&fit=crop", 
      inc: ["3 whole eggs", "1/4 cup chopped tomatoes", "1/4 cup kalamata olives", "1 tbsp feta cheese", "1 cup chopped spinach", "1 tsp extra virgin olive oil"],
      benefit: "A high-protein breakfast essentially 'turns off' the hunger hormone ghrelin for the rest of the day. The olive oil and olives provide oleic acid, which reduces inflammation, a root cause of insulin resistance."
    },
    { 
      name: "Steel-Cut Oats with Almonds & Flax", 
      cals: 320, time: "25 min", 
      tags: ["Complex Carbs", "Heart Healthy"], 
      img: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=400&fit=crop", 
      inc: ["1/3 cup dry steel-cut oats", "1 cup water or soy milk", "1 tbsp ground flaxseed", "1 tbsp sliced almonds", "Pinch of nutmeg"],
      benefit: "Steel-cut oats are minimally processed, requiring the body to do more work to digest them, resulting in a gentle, prolonged energy release. Flaxseed provides lignans and soluble fiber, further stabilizing post-meal blood sugar."
    },
    { 
      name: "Probiotic Greek Yogurt Parfait", 
      cals: 290, time: "5 min", 
      tags: ["Probiotic", "No Cook"], 
      img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=400&fit=crop", 
      inc: ["1 cup plain, full-fat Greek yogurt", "1/4 cup raspberries", "1 tbsp pumpkin seeds", "1 tsp cacao nibs"],
      benefit: "Fermented dairy like Greek yogurt improves microbiome diversity, which is directly linked to better whole-body glucose regulation. Full-fat dairy also increases satiety compared to sugar-laden fat-free alternatives."
    }
  ];

  const lunches = [
    { 
      name: "Grilled Wild Salmon & Kale Bowl", 
      cals: 450, time: "20 min", 
      tags: ["Omega-3", "Iron Rich"], 
      img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=400&fit=crop", 
      inc: ["5 oz wild-caught salmon", "2 cups massaged kale", "1/4 cup quinoa", "1/4 cup cherry tomatoes", "Olive oil and lemon dressing"],
      benefit: "Wild salmon is rich in EPA and DHA, Omega-3 fatty acids that reduce systemic inflammation and decrease hepatic (liver) fat, which is crucial for reversing pre-diabetes. Quinoa adds a complete protein and complex carb."
    },
    { 
      name: "Turkey & Avocado Lettuce Wraps", 
      cals: 380, time: "10 min", 
      tags: ["Low Carb", "Fresh"], 
      img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=400&fit=crop", 
      inc: ["4 large romaine or butter lettuce leaves", "5 oz sliced roasted turkey breast", "1/2 avocado, sliced", "1/4 cup cucumber slices", "Mustard vinaigrette"],
      benefit: "Replacing grain-based wraps with lettuce drastically cuts the carbohydrate load, preventing any significant rise in blood glucose while maintaining volume and satiety. Turkey is highly satiating."
    },
    { 
      name: "Mediterranean Lentil & Feta Salad", 
      cals: 410, time: "15 min", 
      tags: ["High Fiber", "Plant Protein"], 
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&fit=crop", 
      inc: ["1/2 cup cooked green lentils", "1/2 cup diced cucumber", "1/4 cup red onion", "1 oz feta cheese", "1 tbsp olive oil", "Lemon juice"],
      benefit: "Lentils are an incredibly potent food for blood sugar management. They generate a 'second-meal effect,' where their high soluble fiber content blunts the blood sugar spike not only for this meal, but for your subsequent dinner as well."
    },
    { 
      name: "Chicken Apple Walnut Salad", 
      cals: 430, time: "15 min", 
      tags: ["High Protein", "Crunchy"], 
      img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&fit=crop", 
      inc: ["4 oz grilled chicken breast, diced", "1/2 green apple, diced", "2 tbsp crushed walnuts", "1 tbsp Greek yogurt (in place of mayo)", "Served over mixed greens"],
      benefit: "By using Greek yogurt instead of mayonnaise, we increase the protein content and reduce saturated fats. The walnuts provide polyunsaturated fats that aid in cellular repair, and the chicken ensures long-lasting amino acid circulation."
    },
    { 
      name: "Black Bean & Roasted Corn Bowl", 
      cals: 440, time: "20 min", 
      tags: ["Resistant Starch", "Vegan"], 
      img: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=400&fit=crop", 
      inc: ["1/2 cup black beans", "1/4 cup roasted corn", "1/4 cup pico de gallo", "1/4 cup guacamole", "1/2 cup brown rice (cooled)"],
      benefit: "Allowing brown rice to cool after cooking creates 'resistant starch.' This starch bypasses digestion and feeds the good bacteria in your gut, producing short-chain fatty acids (like butyrate) that profoundly improve insulin sensitivity."
    }
  ];

  const dinners = [
    { 
      name: "Grass-Fed Steak with Asparagus", 
      cals: 520, time: "25 min", 
      tags: ["Iron Rich", "Keto"], 
      img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=400&fit=crop", 
      inc: ["6 oz grass-fed flank or sirloin steak", "1 bunch asparagus spears", "1 clove crushed garlic", "1 tbsp olive oil", "Sea salt and black pepper"],
      benefit: "Grass-fed beef contains conjugated linoleic acid (CLA) and a better Omega-3 to Omega-6 ratio than grain-fed beef. Asparagus is a prebiotic vegetable, meaning it feeds the gut microbiome, which handles glucose metabolism."
    },
    { 
      name: "Baked Cod with Roasted Brussels Sprouts", 
      cals: 390, time: "35 min", 
      tags: ["Lean Protein", "Cruciferous"], 
      img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&fit=crop", 
      inc: ["6 oz Atlantic cod fillet", "1.5 cups Brussels sprouts, halved", "1/2 lemon", "1 tbsp avocado oil", "Paprika"],
      benefit: "Brussels sprouts are cruciferous vegetables packed with sulforaphane, a compound that has been shown to reduce fasting blood glucose levels and improve insulin resistance. Cod is an extremely lean protein source."
    },
    { 
      name: "Turkey Zucchini Boats", 
      cals: 410, time: "30 min", 
      tags: ["Low Carb", "Comfort"], 
      img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=400&fit=crop", 
      inc: ["2 medium zucchinis, hollowed", "4 oz lean ground turkey", "1/2 cup sugar-free marinara", "1/4 cup part-skim mozzarella", "Italian seasoning"],
      benefit: "Zucchini serves as a very low-starch, high-water volume vessel, replacing traditional pasta or bread. This prevents the large post-dinner glucose spikes that can lead to overnight hyperinsulinemia."
    },
    { 
      name: "Chicken & Broccoli Cauliflower Fried Rice", 
      cals: 440, time: "20 min", 
      tags: ["High Volume", "Low Glycemic"], 
      img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=400&fit=crop", 
      inc: ["5 oz diced chicken breast", "1.5 cups riced cauliflower", "1 cup chopped broccoli", "1 egg, beaten", "2 tbsp coconut aminos or tamari"],
      benefit: "Swapping white rice for cauliflower rice reduces the meal's carbohydrate content by nearly 80%. Coconut aminos are a low-glycemic, soy-free alternative to soy sauce, helping to maintain stable blood sugar levels."
    },
    { 
      name: "Lemon Herb Mahi Mahi with Quinoa", 
      cals: 460, time: "25 min", 
      tags: ["Pescatarian", "Nutrient Dense"], 
      img: "https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=400&fit=crop", 
      inc: ["6 oz Mahi Mahi fillet", "1/2 cup cooked quinoa", "1 cup steamed green beans", "2 tbsp lemon juice", "Fresh dill and parsley"],
      benefit: "Fish protein is highly insulinogenic, meaning it signals the muscles to take up circulating glucose effectively without requiring excessive amounts of insulin. Quinoa provides a slow-release carbohydrate source for overnight recovery."
    }
  ];

  /* 
    COMPREHENSIVE VEGETARIAN/VEGAN DATABASE 
  */
  
  const vegBreakfasts = [
    { 
      name: "Tofu Scramble with Turmeric & Spinach", 
      cals: 290, time: "15 min", 
      tags: ["Vegan", "Anti-Inflammatory"], 
      img: "https://images.unsplash.com/photo-1546069901-d5bfd20bf63c?q=80&w=400&fit=crop", 
      inc: ["1/2 block extra firm tofu, crumbled", "1 tbsp nutritional yeast", "1/2 tsp turmeric powder", "1 cup baby spinach", "1 tsp olive oil"],
      benefit: "Turmeric contains curcumin, a potent anti-inflammatory compound that directly improves beta-cell function in the pancreas. Tofu provides complete plant-based protein without the saturated fats found in some animal products."
    },
    { 
      name: "Pea Protein & Greens Smoothie", 
      cals: 310, time: "5 min", 
      tags: ["Quick", "High Vitamin"], 
      img: "https://images.unsplash.com/photo-1628557044797-f21a177c37ec?q=80&w=400&fit=crop", 
      inc: ["1 scoop unsweetened pea protein", "1/2 frozen green banana", "1 cup kale", "1 tbsp almond butter", "1 cup unsweetened soy milk"],
      benefit: "Using a green (unripe) banana provides resistant starch rather than the high sugar content of a ripe banana. Pea protein is highly bioavailable and helps preserve lean muscle mass, which acts as a 'sink' for excess blood glucose."
    },
    { 
      name: "Sprouted Grain Avocado Smashing", 
      cals: 330, time: "5 min", 
      tags: ["Vegan", "High Fiber"], 
      img: "https://images.unsplash.com/photo-1484723091791-0fee59ca0b24?q=80&w=400&fit=crop", 
      inc: ["2 slices Ezekiel/sprouted grain bread", "1/2 avocado", "1 tbsp hemp hearts", "Squeeze of lime", "Pinch of sea salt"],
      benefit: "Sprouting grains breaks down phytates and starches, making the bread much lower on the glycemic index compared to standard wheat bread. Hemp hearts add a boost of plant protein and Omega-3s."
    }
  ];

  const vegLunches = [
    { 
      name: "Spicy Edamame & Peanut Soba Noodle Salad", 
      cals: 420, time: "20 min", 
      tags: ["Vegan", "Energy"], 
      img: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=400&fit=crop", 
      inc: ["2 oz 100% buckwheat soba noodles", "1/2 cup shelled edamame", "1/4 cup shredded carrots", "1 tbsp all-natural peanut butter", "1 tsp sriracha and lime juice"],
      benefit: "Proper 100% buckwheat soba noodles are gluten-free and have a much lower glycemic load than wheat pasta. Edamame provides isoflavones, which have been linked to improved glucose tolerance in clinical studies."
    },
    { 
      name: "Warm Quinoa & Roasted Root Vegetable Bowl", 
      cals: 400, time: "30 min", 
      tags: ["Complex Carbs", "Hearty"], 
      img: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=400&fit=crop", 
      inc: ["1/2 cup cooked quinoa", "1/2 cup roasted sweet potatoes", "1/4 cup roasted beets", "2 cups arugula", "Tahini lemon dressing"],
      benefit: "Root vegetables like sweet potatoes and beets contain fiber and nitrates that improve blood flow and metabolic function. The tahini (sesame paste) provides healthy fats that blunt the glycemic impact of the vegetables."
    },
    { 
      name: "Spiced Chickpea & Spinach Stew", 
      cals: 380, time: "25 min", 
      tags: ["Vegan", "High Fiber"], 
      img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&fit=crop", 
      inc: ["1 cup chickpeas", "1 cup crushed tomatoes", "1.5 cups fresh spinach", "Cumin, coriander, and turmeric", "1/4 cup coconut milk"],
      benefit: "Chickpeas are rich in amylose, a slow-digesting starch that prevents sudden spikes in blood sugar. The spices used, particularly cumin and coriander, have established anti-diabetic properties."
    }
  ];

  const vegDinners = [
    { 
      name: "Tempeh & Broccoli Miso Stir-fry", 
      cals: 420, time: "25 min", 
      tags: ["Vegan", "Probiotic"], 
      img: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=400&fit=crop", 
      inc: ["4 oz sliced tempeh", "2 cups broccoli florets", "1 tbsp miso paste", "1 tsp ginger paste", "1/2 cup brown rice"],
      benefit: "Tempeh is fermented soybeans, making its proteins and minerals highly bioavailable compared to unfermented soy. The fermentation process also creates probiotics that support a healthy, glucose-regulating gut microbiome."
    },
    { 
      name: "Zucchini Lasagna Roll-ups", 
      cals: 360, time: "40 min", 
      tags: ["Vegetarian", "Low Carb"], 
      img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=400&fit=crop", 
      inc: ["2 large zucchinis, sliced thin lengthwise", "1/2 cup part-skim ricotta", "1/4 cup mozzarella", "1/2 cup marinara sauce", "Fresh basil"],
      benefit: "By using zucchini slices instead of pasta sheets, this dish drastically cuts down on simple carbohydrates. Ricotta provides casein protein, a slow-digesting protein that prevents overnight blood sugar dips and spikes."
    },
    { 
      name: "Stuffed Bell Peppers with Black Beans & Cauliflower Rice", 
      cals: 380, time: "45 min", 
      tags: ["Vegan", "High Volume"], 
      img: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?q=80&w=400&fit=crop", 
      inc: ["2 large bell peppers", "1 cup cauliflower rice", "1/2 cup black beans", "1/4 cup nutritional yeast", "Salsa and avocado for topping"],
      benefit: "Cauliflower rice mixed with black beans creates a very high-volume, highly satiating meal that is extremely low in glycemic impact. The nutritional yeast provides B-vitamins essential for cellular energy metabolism."
    }
  ];

  const workoutTypes = [
    { title: "Metabolic Accelerator", type: "Full Body", intensity: "Medium" },
    { title: "Core & Stability", type: "Core", intensity: "Low" },
    { title: "HIIT Fat Burner", type: "Cardio", intensity: "High" },
    { title: "Upper Body Strength", type: "Strength", intensity: "Medium" },
    { title: "Active Mobility", type: "Recovery", intensity: "Low" }
  ];

  const wType = workoutTypes[day % workoutTypes.length];
  
  const bTemp = breakfasts[day % breakfasts.length];
  const lTemp = lunches[day % lunches.length];
  const dTemp = dinners[day % dinners.length];

  const vbTemp = vegBreakfasts[day % vegBreakfasts.length];
  const vlTemp = vegLunches[day % vegLunches.length];
  const vdTemp = vegDinners[day % vegDinners.length];

  const exercisesGen = [
    { name: "Jumping Jacks", sets: 3, reps: "45 sec", duration: "1.5 min", image: "https://cdn.pixabay.com/animation/2025/07/22/03/57/03-57-05-380_512.gif", instruction: "Good for vascular health." },
    { name: "Bodyweight Squats", sets: 3, reps: "15 reps", duration: "2 min", image: "https://upload.wikimedia.org/wikipedia/commons/d/df/Bodyweight_Squats.gif", instruction: "Engages large muscle groups to burn glycogen." },
    { name: "Push-ups", sets: 3, reps: "10-12 reps", duration: "2 min", image: "https://cdn.pixabay.com/animation/2025/08/09/09/04/09-04-54-470_512.gif", instruction: "Builds upper body strength." },
    { name: "Plank Hold", sets: 3, reps: "30-60 sec", duration: "3 min", image: "https://gymvisual.com/img/p/3/2/8/5/7/32857.gif", instruction: "Core stabilization." }
  ];

  return {
    day,
    theme: themes[day % themes.length],
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
