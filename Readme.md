# Typescript Math Toolkit Data Statistics

This is an updated port of the Javascript Math Toolkit data statistics class to Typescript.  The JSMathToolkit 'class' derived from code I previously authored in C++ and some methods were ported to Actionscript for use in past Flex projects.

This is the formal alpha release of the Typescript Math Toolkit DataStats class that may be used for basic statistical analysis.

Many of the computations use lazy validation.  It is common to set a data provider and then request multiple statistics based on the supplied data set.  For example, if a user requests the mean of a dataset multiple times, the mean is only computed once and never recomputed until setting the data provider invalidates previously cached computations.

Author:  Jim Armstrong - [The Algorithmist]

@algorithmist

theAlgorithmist [at] gmail [dot] com

Typescript: 2.3.2

Version: 1.0


## Installation

Installation involves all the usual suspects

  - npm and gulp installed globally
  - Clone the repository
  - npm install
  - get coffee (this is the most important step)


### Building and running the tests

1. gulp compile

2. gulp test

The test suite is in Mocha/Chai and specs reside in the _test_ folder.


### TSMT$DataStats

The _TSMT$DataStats_ class consists of several methods to facilitate common statistical analyses of data.  The class uses lazy validation to cache the results of common computations and only recompute those values whenever a data provider is changed.  Care is also taken to ensure the numerical stability of computations such as standard deviation.

Public methods include:


```
isEven(n: number): boolean
set data(dataProvider: Array<number>)
get samples(): number
get min(): number
get max(): number
get fiveNumbers(): Array<number>
get fences(): Object
get mean(): number
get geometricMean(): number
get harmonicMean(): number
get std(): number
get cv(): number
get median(): number
get mode(): number
get skewness(): number
get kurtosis(): number
getQuantile(_p: number): Array<number>
getConfidenceInterval(_t: number): Object
covariance(x: Array<number>, y: Array<number>): number
correlation(x: Array<number>, y: Array<number>): number

```

### Usage

Typical usage of the _TSMT$DataStats_ class is to assign an array of numerical data and then perform statistical queries on that data.


```
 const myStats: TSMT$DataStats = new TSMT$DataStats();
    myStats.data = [17, 12, 14, 17, 13, 16, 18, 20, 13, 12,
      12, 17, 16, 15, 14, 12, 12, 13, 17, 14,
      15, 12, 15, 16, 12, 18, 20, 19, 12, 15,
      18, 14, 16, 17, 15, 19, 12, 13, 12, 15
    ];

 const mean: number   = myStats.mean;
 const median: number = myStats.median;
 const mode: number   = myStats.mode;
 const std: number    = myStats.std;
```


Refer to the specs in the _test_ folder for more usage examples.  I must apologize that the current test suite is modest at best.  Some methods are not currently tested, however, I have used them extensively in actual applications from the C++ or JS predecessors to this class.


License
----

Apache 2.0

**Free Software? Yeah, Homey plays that**

[//]: # (kudos http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

[The Algorithmist]: <http://algorithmist.net>

