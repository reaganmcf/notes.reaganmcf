---
slug: "/data101/lecture-1"
date: "2021-01-20"
title: "Data 101 - Plots"
---

## Categorical, Numerical, and Ordinal Variables

- `CAT`: Grade like A, B, C, D
- `NUM`: Numerical: SCORE: like 89.64
- `ORD`: Ordinal ordered categorical: D < C < B < A

### Which plot to use

- It all depends on the variables
  - NUM x NUM = Scatter
  - CAT x CAT = Mosaic
  - CAT x NUM = Box
  - NUM = Bar plot, Histogram
  - CAT = Bargraph

### What makes data interesting?

- Contradictory to our expectations? So called "Bayesian Prior"
- Outliers
- High Correlation
- What are Top K, Bottom K values?
- Look what I found - can't wait to show you...
  - Salaries do not depend on education?
  - Salaries clearly are postively correlated with education
  - If groom and bride are born under the same sign THEN marriage has much higher chance to survive

#### Interesting vs Actionable?

Interesting:

- Wines from Montenegro are much more expensive than French Wines
- Californian wines are rated the highest
- Sweden has the highest cost of living
- Greatest basketball players are more than 6'7" or taller

Actionable:

- Honda has the best repair record
- Vegetarians live 3 years longer
- Lincoln tunnel traffic is higher than Holland tunnel traffic on weekends

### Why look for patterns, trends?

- Actionable
  - We can do something based on the analysis which will benefit someone
- Data Cleaning
  - Biased data collection, errors, missing data
- Curiosity
  - Did you know that

### How much R do I need to know?

- One Liners
- `student_performance <- read.csv("MOODY.csv")`
- `boxplot(student_performance$SCORE, main='My first Boxplot')`

- ```
  mosaicplot(moody$GRADE~moody$ON_SMARTPHONE)
  ```
