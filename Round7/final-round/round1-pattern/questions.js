// ============================================================ 
// ROUND 7 - STAGE 1: MAT-STYLE PATTERN DECODING 
// HARD DIFFICULTY - QUESTIONS DATA FILE 
// (answer key added to each question object) 
// ============================================================ 
 
const round1Questions = [ 
 
    { 
        id: 1, 
        title: "BLOOD RELATION 01", 
        category: "Blood Relations", 
        prompt: "Pointing to a girl, Arun said: “She is the daughter of my mother’s only son.” How is the girl related to Arun?", 
        displayContent: "Arun → Mother's only son → Daughter<br><br>How is the girl related to Arun?", 
        hint: "Identify who the mother's only son is.", 
        inputPlaceholder: "Enter relationship...", 
        type: "text", 
        answer: "Daughter", 
        explanation: "Arun's mother's only son is Arun himself. Therefore, the girl is Arun's daughter." 
    }, 
 
    { 
        id: 2, 
        title: "NUMBER SERIES 02", 
        category: "Number Series", 
        prompt: "Find the missing number:", 
        displayContent: "5 &nbsp;&nbsp; 11 &nbsp;&nbsp; 23 &nbsp;&nbsp; 47 &nbsp;&nbsp; 95 &nbsp;&nbsp; ?", 
        hint: "Look at the relationship between each term and the next.", 
        inputPlaceholder: "Enter next number...", 
        type: "text", 
        answer: "191", 
        explanation: "Each term is multiplied by 2 and then 1 is added: 5×2+1=11, 11×2+1=23, 23×2+1=47, 47×2+1=95. Therefore, 95×2+1=191." 
    }, 
 
    { 
        id: 3, 
        title: "ALPHABET SERIES 03", 
        category: "Alphabet Series", 
        prompt: "Find the missing letter:", 
        displayContent: "C &nbsp;&nbsp; F &nbsp;&nbsp; J &nbsp;&nbsp; O &nbsp;&nbsp; U &nbsp;&nbsp; ?", 
        hint: "Convert the letters into their alphabet positions and examine the increasing gaps.", 
        inputPlaceholder: "Enter missing letter...", 
        type: "text", 
        answer: "B", 
        explanation: "Alphabet positions are C=3, F=6, J=10, O=15 and U=21. The gaps are +3, +4, +5 and +6. The next gap is +7. 21+7=28. Since the alphabet has 26 letters, 28 wraps around to 2, which is B." 
    }, 
 
    { 
        id: 4, 
        title: "BLOOD RELATION 04", 
        category: "Blood Relations", 
        prompt: "P is the brother of Q. Q is the mother of R. S is the father of P. How is S related to R?", 
        displayContent: "S → Father of P<br>P → Brother of Q<br>Q → Mother of R<br><br>How is S related to R?", 
        hint: "First determine S's relationship with Q.", 
        inputPlaceholder: "Enter relationship...", 
        type: "text", 
        answer: "Grandfather", 
        explanation: "P and Q are siblings. Since S is P's father, S is also Q's father. Q is R's mother, so S is R's grandfather." 
    }, 
 
    { 
    id: 5, 
    title: "AVERAGE & ODD NUMBERS 05", 
    category: "Average and Number Logic", 
    prompt: "The average of 5 consecutive odd numbers is 61. What is the largest number?", 
    displayContent: "Average = 61<br>5 consecutive odd numbers<br>Largest number = ?", 
    hint: "In consecutive odd numbers, the average is the middle number.", 
    inputPlaceholder: "Enter largest number...", 
    type: "text", 
    answer: "65", 
    explanation: "Since the five numbers are consecutive odd numbers and their average is 61, the middle number is 61. The numbers are 57, 59, 61, 63, 65. Therefore, the largest number is 65." 
},, 
 
    { 
        id: 6, 
        title: "ALPHABET CODING 06", 
        category: "Alphabet Coding", 
        prompt: "If CAT is coded as DBU, how is FISH coded?", 
        displayContent: "CAT → DBU<br><br>FISH → ?", 
        hint: "Each letter is shifted by the same number of positions.", 
        inputPlaceholder: "Enter coded word...", 
        type: "text", 
        answer: "GJTI", 
        explanation: "Each letter moves one position forward: C→D, A→B and T→U. Applying the same rule: F→G, I→J, S→T and H→I. Therefore FISH → GJTI." 
    }, 
 
    { 
        id: 7, 
        title: "ODD NUMBER 07", 
        category: "MAT Odd One Out", 
        prompt: "Which number does not belong to the group?", 
        displayContent: "8 &nbsp;&nbsp; 27 &nbsp;&nbsp; 64 &nbsp;&nbsp; 100 &nbsp;&nbsp; 125", 
        hint: "Check whether each number is a perfect cube.", 
        inputPlaceholder: "Enter odd number...", 
        type: "text", 
        answer: "100", 
        explanation: "8=2³, 27=3³, 64=4³ and 125=5³. But 100 is not a perfect cube. Therefore, 100 is the odd one out." 
    }, 
 
    { 
        id: 8, 
        title: "WORK & EFFICIENCY 08", 
        category: "Work and Efficiency", 
        prompt: "A person can complete a job in 120 days. He works alone on Day 1. On Day 2, another person of equal efficiency joins him. On Day 3, another person joins, and so on. Every day, a new person with the same efficiency joins the work. How many days are required to complete the job?", 
        displayContent: "Day 1 → 1 worker<br>Day 2 → 2 workers<br>Day 3 → 3 workers<br>...<br>Day ? → ?", 
        hint: "One worker completes 1/120 of the job per day. Add the number of workers working each day.", 
        inputPlaceholder: "Enter number of days...", 
        type: "text", 
        answer: "15", 
        explanation: "One worker completes 1/120 of the job per day. After n days, total worker-days are 1+2+3+...+n = n(n+1)/2. We need n(n+1)/2=120. Since 15×16/2=120, the job is completed in 15 days." 
    }, 
 
    { 
        id: 9, 
        title: "BLOOD RELATION 09", 
        category: "Blood Relations", 
        prompt: "Amit said: “The boy in the red shirt is my father’s only grandson.” Amit has a son named Priyansh. How is the boy related to Amit?", 
        displayContent: "Amit → Son → Priyansh<br><br>Amit's father's only grandson = ?", 
        hint: "Amit's father's grandson through Amit is Amit's son.", 
        inputPlaceholder: "Enter relationship...", 
        type: "text", 
        answer: "Son", 
        explanation: "Amit's father is the boy's grandfather. Since Amit has a son named Priyansh, the boy referred to is Amit's son. Therefore, the boy is Amit's son." 
    }, 
 
    { 
        id: 10, 
        title: "NUMBER SERIES 10", 
        category: "Number Series", 
        prompt: "Find the missing number:", 
        displayContent: "2 &nbsp;&nbsp; 5 &nbsp;&nbsp; 12 &nbsp;&nbsp; 27 &nbsp;&nbsp; 58 &nbsp;&nbsp; ?", 
        hint: "The multiplier is 2 and the number being added increases by 1 each time.", 
        inputPlaceholder: "Enter next number...", 
        type: "text", 
        answer: "121", 
        explanation: "The pattern is ×2+1, ×2+2, ×2+3, ×2+4 and then ×2+5. Therefore, 58×2+5=121." 
    }, 
 
    { 
        id: 11, 
        title: "ALPHABET SERIES 11", 
        category: "Alphabet Series", 
        prompt: "Find the missing term:", 
        displayContent: "AZ &nbsp;&nbsp; CX &nbsp;&nbsp; EV &nbsp;&nbsp; GT &nbsp;&nbsp; ?", 
        hint: "Look at the first and second letters separately.", 
        inputPlaceholder: "Enter missing term...", 
        type: "text", 
        answer: "IR", 
        explanation: "First letters: A, C, E, G → each increases by 2, so the next is I. Second letters: Z, X, V, T → each decreases by 2, so the next is R. Therefore, the answer is IR." 
    }, 
 
    { 
        id: 12, 
        title: "NUMBER LOGIC 12", 
        category: "MAT Number Logic", 
        prompt: "Find the missing number:", 
        displayContent: "4 → 20<br>6 → 42<br>8 → 72<br>11 → ?", 
        hint: "Multiply each number by the number immediately following it.", 
        inputPlaceholder: "Enter missing number...", 
        type: "text", 
        answer: "132", 
        explanation: "The rule is n×(n+1). Thus 4×5=20, 6×7=42 and 8×9=72. Therefore, 11×12=132." 
    }, 
 
    { 
        id: 13, 
        title: "BLOOD RELATION 13", 
        category: "Blood Relations", 
        prompt: "A and B are brothers. C and D are sisters. A's son is D's brother. How is B related to C?", 
        displayContent: "A — Brother — B<br>A → Son → D<br>C — Sister — D<br><br>How is B related to C?", 
        hint: "First determine the relationship between A and C.", 
        inputPlaceholder: "Enter relationship...", 
        type: "text", 
        answer: "Uncle", 
        explanation: "A's son is D's brother, so D is A's daughter. Since C and D are sisters, C is also A's daughter. B is A's brother. Therefore, B is C's uncle." 
    }, 
 
    { 
        id: 14, 
        title: "PROFIT & DISCOUNT 14", 
        category: "Profit and Discount", 
        prompt: "If Fatima sells 60 identical toys at a 40% discount on the printed price, she makes a 20% profit. Ten of these toys are destroyed in a fire. While selling the rest, what discount should be given on the printed price so that she can make the same amount of profit?", 
        displayContent: "60 toys → 40% discount → 20% profit<br>10 toys destroyed → 50 toys remain<br>Required discount → ?", 
        hint: "First find the cost price of one toy and the original total profit. Then recover the same profit from the 50 remaining toys.", 
        inputPlaceholder: "Enter discount percentage...", 
        type: "text", 
        answer: "28%", 
        explanation: "Let the printed price be ₹100. A 40% discount gives a selling price of ₹60. Since this is a 20% profit, cost price = 60/1.20 = ₹50. Total cost of 60 toys = ₹3000. Original revenue = 60×60 = ₹3600, giving a profit of ₹600. After 10 toys are destroyed, 50 remain. To make the same ₹600 profit, total revenue must still be ₹3600. Required selling price per toy = 3600/50 = ₹72. Therefore, discount = ₹100−₹72 = ₹28, or 28%." 
    }, 
 
    { 
        id: 15, 
        title: "AVERAGE & PERCENTAGE 15", 
        category: "Average and Percentage", 
        prompt: "A class consists of 20 boys and 30 girls. In the mid-semester examination, the average score of the girls was 5 higher than that of the boys. In the final exam, however, the average score of the girls dropped by 3 while the average score of the entire class increased by 2. What was the increase in the average score of the boys?", 
        displayContent: "Boys = 20<br>Girls = 30<br>Girls' average change = -3<br>Class average change = +2<br><br>Boys' average increase = ?", 
        hint: "Girls are 60% of the class and boys are 40%. Account for the girls' decrease before calculating the boys' increase.", 
        inputPlaceholder: "Enter increase in marks...", 
        type: "text", 
        answer: "9.5", 
        explanation: "Girls are 30/50 = 60% of the class. Their average falling by 3 reduces the overall class average by 3×0.60 = 1.8 marks if the boys' average stays unchanged. But the overall average actually increases by 2, so the boys must contribute 2+1.8 = 3.8 marks to the class average. Boys are 40% of the class, so their average increase = 3.8/0.40 = 9.5 marks." 
    } 
]; 
 
if (typeof window !== 'undefined') { 
    window.round1Questions = round1Questions; 
}