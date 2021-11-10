# generalized-Metalog
Generalized Metalog with IIDs
Based on the paper (http://www.metalogdistributions.com/images/Metalogs_and_the_Sum_of_Lognormals_in_Closed_Form.pdf)[THE METALOG DISTRIBUTIONS AND EXTREMELY ACCURATE SUMS OF LOGNORMALS IN CLOSED FORM] by:

Thomas W. Keelin 
Lonnie Chrisman
Sam L Savage

Sums of independent, identically distributed lognormal distributions are used for rare event, asset price simulations among others. 

CAUTION - The interpolatable a Coeffiecents have not been independently verified.

This app was inspired by the a spreadsheet model found at ProbabilityManagement.org.

"The method of Generalized Metalogs can closely approximate virtually any continuous distribution that may be simulated, and depends on only a few input parameters. The idea is to run extensive calculations at representative grid points then calculate the a-coefficients for a Metalog at each point. These coefficients are stored in an interpolatable lookup table."

Enter as many monte carlo trials as you like. Currently hardcoded to 1000.
Use at own risk. Subject to change. PRs accepted.

TODO: 
- Catch known issue when p50 or p90 sliders are set to extremes.
- Don't allow sliders to cross over. ie p90 can't be less than p50.