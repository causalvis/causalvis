# The following is from https://nbviewer.org/github/IBM/causallib/blob/master/examples/lalonde.ipynb

import pandas as pd

columns = ["training",   # Treatment assignment indicator
           "age",        # Age of participant
           "education",  # Years of education
           "black",      # Indicate whether individual is black
           "hispanic",   # Indicate whether individual is hispanic
           "married",    # Indicate whether individual is married
           "no_degree",  # Indicate if individual has no high-school diploma
           "re74",       # Real earnings in 1974, prior to study participation
           "re75",       # Real earnings in 1975, prior to study participation
           "re78"]       # Real earnings in 1978, after study end

#treated = pd.read_csv("http://www.nber.org/~rdehejia/data/nswre74_treated.txt", 
#                      delim_whitespace=True, header=None, names=columns)
#control = pd.read_csv("http://www.nber.org/~rdehejia/data/nswre74_control.txt",
#                      delim_whitespace=True, header=None, names=columns)
# file_names = ["http://www.nber.org/~rdehejia/data/nswre74_treated.txt",
#               "http://www.nber.org/~rdehejia/data/nswre74_control.txt",
#               "http://www.nber.org/~rdehejia/data/psid_controls.txt",
#               "http://www.nber.org/~rdehejia/data/psid2_controls.txt",
#               "http://www.nber.org/~rdehejia/data/psid3_controls.txt",
#               "http://www.nber.org/~rdehejia/data/cps_controls.txt",
#               "http://www.nber.org/~rdehejia/data/cps2_controls.txt",
#               "http://www.nber.org/~rdehejia/data/cps3_controls.txt"]
file_names = ["./nsw_treated.txt"]
files = [pd.read_csv(file_name, delim_whitespace=True, header=None, names=columns) for file_name in file_names]
lalonde = pd.concat(files, ignore_index=True)
lalonde = lalonde.sample(frac=1.0, random_state=42)  # Shuffle

lalonde.to_json("./nsw_treated.json", orient="records")

# print(lalonde.shape)
# lalonde.head()

