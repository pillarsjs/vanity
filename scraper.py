# -*- coding: utf-8 -*-
from bs4 import BeautifulSoup
from urllib.request import urlopen
import time
import datetime as dt
import json
import sys

organization = sys.argv[1]
package = sys.argv[2]

print("---------------- SCRAPER.PY STARTED---------------")

if organization == None or package == None:
	print("WARNING! Wrong arguments! I will stop now!")
	sys.exit()
else:
	print("Current organization provided:", organization)
	print("Current package provided:", package)

final_data = {}
final_data["organization"] = organization
final_data["repository"] = package


# NPM
npm_url = "https://www.npmjs.com/package/" + package
request = urlopen(npm_url)
if request.getcode() == 200:
	print("Scraping now:", npm_url)
	
	request = request.read()
	soup = BeautifulSoup(request, "html.parser")
	
	final_data["npm"]= {}
	final_data["npm"]["daily_downloads"] = int(soup.find("strong", { "class" : "daily-downloads"}).text.strip())
	final_data["npm"]["weekly_downloads"] = int(soup.find("strong", { "class" : "weekly-downloads"}).text.strip())
	final_data["npm"]["monthly_downloads"] = int(soup.find("strong", { "class" : "monthly-downloads"}).text.strip())

else:
	print("Error scraping:", npm_url)

# Github
github_url = "https://github.com/" + organization + "/" + package
request = urlopen(github_url)
if request.getcode() == 200:
	print("Scraping now:", github_url)

	request = request.read()

	soup = BeautifulSoup(request, "html.parser")
	
	final_data["description"] = soup.find("div", {"class": "repository-meta-content"}).text.strip()

	final_data["github"] = {}

	slc_social_count = soup.findAll("a", {"class": "social-count"})
	final_data["github"]["total_watchers"] = int(slc_social_count[0].text.strip())
	final_data["github"]["total_stars"] = int(slc_social_count[1].text.strip())
	final_data["github"]["total_forks"] = int(slc_social_count[2].text.strip())
	
	slc_counter  = soup.findAll("span", {"class": "Counter"})
	final_data["github"]["total_open_issues"] = int(slc_counter[0].text.strip())
	final_data["github"]["total_open_pr"] = int(slc_counter[1].text.strip())

	slc_num  = soup.findAll("span", {"class": "num"})	
	final_data["github"]["total_commits"] = int(slc_num[0].text.strip())
	final_data["github"]["total_branches"] = int(slc_num[1].text.strip())	
	final_data["github"]["total_releases"] = int(slc_num[2].text.strip())
	
else:
	print("Error scraping:", github_url)

text_file = open("data/"+package+".json", "w")
print("Saving data in", package + ".json")
text_file.write(json.dumps(final_data, sort_keys=True, ensure_ascii=False, indent=4))
text_file.close()

print("----------- SCRAPER.PY ENDED SUCCESFULLY----------")