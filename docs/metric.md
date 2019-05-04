# Generating an application Metric

An applicaiton metric is the important coefficient your app is responsible for in using behavior-based notifications. Its purpose is to tell a story about how far the user has progressed. There are some sublties involved in properly implementing this. Let's get into the details.

## Normal metric

We assume that the metric _n_ is normal: specifically, that it scales between 0-1 and each incremental increase in _n_ represents strictly more progress than _n'_ < _n_. A great example of this is a grade for a class. 

Each individual grade a student earns as they progress tthrough the class is not necessarily reflective of their grade in the class as a whole. A 95% where the student failed to earn a few points in the topics at the end of the cohort represents no more progress in the objectives than a grade of 95% where the student failed to earn some points early on. If there were only two pieces of information in difference in the previous two samples, then if the instructor values the last piece more htan the former in terms of course objectives, they must change the weighting of the grade to reflect that. 

### Differentiability

Coprimality comes into play here as well. This is likely not important to most instructors, but one can allow differentiabiltty in grades by working wiht coprime measures (assignments, etc).

### Diminuation 

The metric does no need to chart a single course to a single objective, and is revertable. That is, students can lose or gain the in the metric over time.

## How and When to apply a metric

It is important to generate a metric at least roughly daily given daily use. You should not however generate a metric without user input. One of the key factors in the forecast is the alignment of changes in user behavior, detected through location data, to the expected performance of the user: as practice is important in any task suitable for behavior-based notifications, frequency most strongly correlates with performance. That is, the lack of metric data is itself an indicator of performance.

The system can tolerate metric data generated continuously through user interaction, as in the example here, but this is certainly not necessary. Sparse data is in a sense even easier to generate predicitons from.

There is no dependency between metric and device -- the same metric shoudl be reported regardless of which device the user is using. If your app has a web interface, it too should share a common metric, and report results, even though the user is not presumed to be on _any_ device at that time.
