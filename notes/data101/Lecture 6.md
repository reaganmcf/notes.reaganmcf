---
slug: "/data101/lecture-6"
date: "2021-02-03"
title: "Data 101 - Free Style Data Exploration"
---

# Free Style Data Exploration

Stages of Data Exploration - "you are given data set... what's next"

1. Poking around - "kicking the tires" - preliminary plots and queries
2. Anything interesting? Finding candidate hypothesis
3. Evaluating the hypothesis - Statistics (coming next week)
4. Telling a story with data - presenting the results

## Professor Moody Data Set as Example

What are potential questions?

1. About Professor Moody: How is he grading? How to pass the class? is this fair grading?
2. About his class - Behaviors: texting, asking questions, dozing off, participating, leaving early, coming late, etc. General analysis

### Poking Around

1. Plot!
2. What plots can you make on Moody data set? And what would these plot tell you about Moody data set?

- Barplot of grades, ask_questions, on_smartphone, etc.

How many plots can one make for Professor Moody set?

`Moody[grade, score, texting, questions, participation]`
2 Numerical and 3 Categorical variables

1. 5 Single attribute plots

- 3 Bar plots - on Grade, Texting, and Questions
- 2 Box plots - on Score and on Participation

2.

- Scatter plot of grade vs. participation = 1
- (3 choose 2) mosaic plots = 3
- 6 multi-box plots `boxplot(numerical ~ categorical)`

#### But much more! 65 more plots

So far, 15 plots... but now lets subset the moody data frame

1. Grade has 5 values and texting and questions have 4 values each (never, rarely, often, always)
2. How many box plots can we create for subsets of moody by (Attribute == value)? `moody[moody$texting == 'always']$grade`
3. 4 x 2 + 4 x 2 + 5 x 2 = 26 bar plots over subsets of moody
4. 2 x (4 + 4 + 5) = 26 box plots over subsets of moody
5. Scatter plots (grade vs. participation) on simple subsets of moody data frame (attribute = value) = 4 + 4 + 5 over subsets of moody = 13 scatter plots

#### So far 80 plots ... just from 5 attributes

- But wait ... there's so much more!
- How about conjunctions? Subsets like "always texting and never asking questions A students"?
- This will be **HUNDREDS OF PLOTS**
