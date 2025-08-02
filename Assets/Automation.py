import pandas as pd
import json, pyperclip

with open("Chars.txt", "r", encoding="utf-8") as f:
    data = f.read().rsplit("\n")
    chars = {}
    for i in data:
        chars[i[0]] = i[1]



def toGreek(s):
    st = ""
    keys = chars.keys()
    for i in s:
        if i.lower() in keys:
            st += chars[i.lower()].upper()
        else:
            st += i.upper()
    return st


data = pd.read_excel("2024Spreadsheet.xlsx")

def getTeachers(data: pd.read_excel):
    teachers = []
    for i in range(40):
        try:
            s = data.iloc[1+i, 0]
            teachers.append(toGreek(s))
        except Exception as e:
            print(f"Exception: {e}, for iy: {i}")
            break
    print(teachers)
    with open("Teachers.json", "w") as f:
        json.dump(teachers, f)

def getClasses(data: pd.read_excel):
    timetable = []
    classes = []
    for ix in range(35):
        temp = []
        for iy in range(40):
            try:
                t = str(data.iloc[1+iy, ix+1])
                if t == "nan":
                    temp.append([])
                else:
                    t = toGreek(t)
                    if t not in classes:
                        classes.append(t)
                    temp.append([t])
            except Exception as e:
                print(f"Exception: {e}, for iy: {iy}")
                break
        timetable.append(temp)
    print(classes)
    for i2, i in enumerate(timetable):
        temp = []
        for j in i:
            temp += j
        temp2 = list(dict().fromkeys(temp))
        if len(temp2) != len(temp):
            print(f"You messed up in {i2} | {temp2}, {temp}")
    cl = {"first": ["Α", "Β", "Γ"], "second": [[], [], []], "third": [[], [], []]}
    for i in classes:
        if i.startswith("Α"):
            cl["second"][0].append(i)
        else:
            if i.startswith("Β"):
                if len(i) == 2:
                    if i[1].isdigit():
                        cl["second"][1].append(i)
                    #else:
                    #    cl["third"][1].append(i)
                else:
                    cl["third"][1].append(i)
            if i.startswith("Γ"):
                if len(i) == 2:
                    cl["second"][2].append(i)
                else:
                    cl["third"][2].append(i)
    for i in range(3):
        cl["second"][i].sort()
        cl["third"][i].sort()
    print(cl)

    with open("SelectClass.json", "w") as f:
        json.dump(cl, f)

    with open("Timetable.json", "w") as f:
        json.dump(timetable, f)


getTeachers(data)
getClasses(data)


with open("Classes.json", "r") as f:
    classes = json.load(f)

with open("SelectClass.json", "r") as f:
    sc = json.load(f)

with open("Teachers.json", "r") as f:
    teachers = json.load(f)

with open("Timetable.json", "r") as f:
    timetable = json.load(f)

dic = {"teachers": teachers, "classes": sc, "timetable": timetable}
with open("data.json", "w") as f:
    json.dump(dic, f)

pyperclip.copy(json.dumps(dic))
