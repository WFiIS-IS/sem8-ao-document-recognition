import cv2
import numpy as np
import pandas as pd
from matplotlib import pyplot as plt
import sys

big_photo_h = 200
big_photo_w = 160


def create_mask(shape, *, offset=15, max=240):
    h, w = shape[:2]
    h = h - 2*offset
    w = w - 2*offset
    base_grad = np.linspace(0, max, offset) / 255

    corner = np.tile(base_grad, reps=(offset, 1))
    corner = np.min(np.dstack((corner, corner.T)), axis=2)

    left_edge = np.tile(base_grad, reps=(h, 1))
    top_edge = np.tile(base_grad, reps=(w, 1)).T

    top_edge = np.hstack((corner, top_edge, np.fliplr(corner)))

    mask = np.full((h, w), max / 255)
    mask = np.hstack((left_edge, mask, np.fliplr(left_edge)))
    mask = np.vstack((top_edge, mask, np.flipud(top_edge)))

    return np.dstack([mask]*3)


def scale_and_crop_photo(photo, new_shape):
    photo_h, photo_w = photo.shape[:2]
    new_h, new_w = new_shape
    scaled_w = int(photo_w * new_h / photo_h)
    dim = (new_h, scaled_w)

    scaled = cv2.resize(photo, dim, interpolation=cv2.INTER_AREA)
    offset_l = (scaled_w - new_w) // 2
    offset_r = scaled_w-new_w-offset_l

    return scaled[:, offset_l:scaled_w-offset_r]


def print_lastname(licence, lastname: str):
    font = cv2.FONT_HERSHEY_DUPLEX
    x, y = 280, 145

    cv2.putText(licence, lastname.upper(), (x, y), font,
                fontScale=0.7, color=(0, 0, 0),
                thickness=2, lineType=cv2.LINE_AA)


def print_firstname(licence, firstname: str):
    font = cv2.FONT_HERSHEY_DUPLEX
    x, y = 280, 170

    cv2.putText(licence, firstname.upper(), (x, y), font,
                fontScale=0.7, color=(0, 0, 0),
                thickness=1, lineType=cv2.LINE_AA)


def print_signature(licence, signature: str):
    font = cv2.FONT_HERSHEY_SCRIPT_SIMPLEX
    x, y = 280, 350

    cv2.putText(licence, signature, (x, y), font,
                fontScale=0.8, color=(0, 0, 0),
                thickness=1, lineType=cv2.LINE_AA)


def print_category(licence, drive_category: str = "AM/B/D"):
    font = cv2.FONT_HERSHEY_DUPLEX
    x, y = 110, 407

    cv2.putText(licence, drive_category, (x, y), font,
                fontScale=0.6, color=(0, 0, 0),
                thickness=1, lineType=cv2.LINE_AA)


def print_other(licence,
                birthdate="01.01.1990", pesel="0123",
                licence_numer="12345/67/89",
                startdate="04.03.2019", enddate="04.03.2029",
                office="PREZYDENT m. st. WARSZAWY"):
    font = cv2.FONT_HERSHEY_SIMPLEX

    x, y = 280, 190
    cv2.putText(licence, birthdate, (x, y), font,
                fontScale=0.5, color=(0, 0, 0),
                thickness=1, lineType=cv2.LINE_AA)

    x, y = 280, 212
    cv2.putText(licence, startdate, (x, y), font,
                fontScale=0.5, color=(0, 0, 0),
                thickness=1, lineType=cv2.LINE_AA)

    x, y = 280, 235
    cv2.putText(licence, enddate, (x, y), font,
                fontScale=0.5, color=(0, 0, 0),
                thickness=1, lineType=cv2.LINE_AA)

    x, y = 280, 257
    cv2.putText(licence, office, (x, y), font,
                fontScale=0.5, color=(0, 0, 0),
                thickness=1, lineType=cv2.LINE_AA)

    x, y = 280, 302
    cv2.putText(licence, pesel, (x, y), font,
                fontScale=0.5, color=(0, 0, 0),
                thickness=1, lineType=cv2.LINE_AA)

    x, y = 280, 323
    cv2.putText(licence, licence_numer, (x, y), font,
                fontScale=0.5, color=(0, 0, 0),
                thickness=1, lineType=cv2.LINE_AA)


def print_watermark(licence):
    h, w = licence.shape[:2]
    text = "WZOR"
    font = cv2.FONT_HERSHEY_DUPLEX
    fontScale = 7
    thickness = 1

    mask = np.zeros((h, w), dtype=np.uint8)

    (text_w, text_h), _ = cv2.getTextSize(text, font, fontScale, thickness)
    text_pos = ((w-text_w) // 2, (h+text_h) // 2)
    cv2.putText(mask, "WZOR", text_pos, font, fontScale,
                color=(255), lineType=cv2.LINE_AA, thickness=thickness)

    M = cv2.getRotationMatrix2D((w/2, h/2), 30, 1)
    mask = cv2.warpAffine(mask, M, (w, h))
    text = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGR)

    cv2.add(licence, text, mask=~mask, dst=licence)


def print_big_photo(licence, photo):
    dim = (200, 160)
    x, y = 85, 155
    h, w = dim

    roi = licence[y:y+h, x:x+w]
    photo = scale_and_crop_photo(photo, dim)

    mask = create_mask(dim, offset=15, max=230)
    photo = photo * mask + roi * (1-mask)

    licence[y:y+h, x:x+w] = photo


def print_small_photo(licence, photo):
    dim = (75, 60)
    x, y = 540, 240
    h, w = dim

    roi = licence[y:y+h, x:x+w]
    photo = scale_and_crop_photo(photo, dim)

    mask = create_mask(dim, offset=6, max=150)
    photo = photo * mask + roi * (1-mask)

    licence[y:y+h, x:x+w] = photo


licence_template = cv2.imread("./wzor-prawo-jazdy.jpg")
personal = pd.read_csv("./personal.csv", header=0, dtype="str")

font1 = cv2.FONT_HERSHEY_DUPLEX

for i in range(0, 10):
    licence = licence_template.copy()
    photo = cv2.imread(f"./faces/person{i+1:02}-1.png")
    person = personal.iloc[i]

    print_big_photo(licence, photo)
    print_small_photo(licence, photo)

    print_watermark(licence)

    print_lastname(licence, person["LastName"])
    print_firstname(licence, person["FirstName"])
    print_signature(licence, f'{person["FirstName"]} {person["LastName"]}')
    print_other(licence, 
                birthdate=person["DateOfBirth"], 
                pesel=person["PESEL"],
                licence_numer=person["DrivingLicenceNumber"],
                startdate=person["DrivingLicenceIssueDate"],
                enddate=person["DrivingLicenceValidityDate"],
            )
    print_category(licence, drive_category=person["DrivingLicenceCategories"])

    if not cv2.imwrite(f"./driving-licence/person{i+1:02}.jpg", licence):
        print("writing image failed (check directory existence)")
        break
