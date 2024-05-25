import cv2
import numpy as np
import pandas as pd


def create_mask(shape, *, offset=15, max=240):
    w, h = shape[:2]
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


def print_watermark(licence):
    h, w = licence.shape[:2]
    text = "WZOR"
    font = cv2.FONT_HERSHEY_DUPLEX
    fontScale = 5
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


def scale_and_crop_photo(photo, new_shape):
    photo_h, photo_w = photo.shape[:2]
    new_w, new_h = new_shape
    scaled_w = int(photo_w * new_h / photo_h)
    dim = (new_h, scaled_w)

    scaled = cv2.resize(photo, dim, interpolation=cv2.INTER_AREA)
    offset_l = (scaled_w - new_w) // 2
    offset_r = scaled_w-new_w-offset_l

    return scaled[:, offset_l:scaled_w-offset_r]


def print_big_photo(licence, photo):
    dim = (135, 165)
    x, y = 325, 119
    w, h = dim

    roi = licence[y:y+h, x:x+w]
    photo = scale_and_crop_photo(photo, dim)

    mask = create_mask(dim, offset=15, max=230)
    photo = photo * mask + roi * (1-mask)

    licence[y:y+h, x:x+w] = photo


def print_personal_information(identity_card, person: pd.Series):

    els_issue_date = person["ElsIssueDate"]
    els_id = person["ElsId"]
    pesel = person["PESEL"]
    address = '-'
    firstname = person["FirstName"]
    lastname = person["LastName"]
    university_name_1 = 'Akademia Gorniczo-Hutnicza'
    university_name_2 = 'im. Stanislawa Stashica'
    university_name_3 = 'w Krakowie'

    # ELS issue date
    x, y = 98, 213
    cv2.putText(identity_card, els_issue_date, org=(x, y),
                fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                fontScale=0.4, color=(0, 0, 0),
                thickness=1, lineType=cv2.LINE_AA)

    # ELS Id
    x, y = 98, 229
    cv2.putText(identity_card, els_id, org=(x, y),
                fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                fontScale=0.4, color=(0, 0, 0),
                thickness=1, lineType=cv2.LINE_AA)

    # PESEL
    x, y = 98, 245
    cv2.putText(identity_card, pesel, org=(x, y),
                fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                fontScale=0.4, color=(0, 0, 0),
                thickness=1, lineType=cv2.LINE_AA)

    # Address
    x, y = 98, 261
    cv2.putText(identity_card, address, (x, y),
                fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                fontScale=0.4, color=(0, 0, 0),
                thickness=1, lineType=cv2.LINE_AA)

    # First and last name
    origin_x = 230
    y = 130
    y_step = 15

    font = cv2.FONT_HERSHEY_SIMPLEX
    fontScale = 0.4
    thickness = 1

    y += y_step
    (text_w, _), _ = cv2.getTextSize(firstname, font, fontScale, thickness)
    cv2.putText(identity_card, firstname, (origin_x - text_w//2, y),
                fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                fontScale=fontScale, color=(0, 0, 0),
                thickness=thickness, lineType=cv2.LINE_AA)

    y += y_step
    (text_w, _), _ = cv2.getTextSize(lastname, font, fontScale, thickness)
    cv2.putText(identity_card, lastname, (origin_x - text_w//2, y),
                fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                fontScale=fontScale, color=(0, 0, 0),
                thickness=thickness, lineType=cv2.LINE_AA)

    # University name
    origin_x = 325
    y = 35
    y_step = 15

    font = cv2.FONT_HERSHEY_SIMPLEX
    fontScale = 0.4
    thickness = 1

    y += y_step
    (text_w, _), _ = cv2.getTextSize(
        university_name_1, font, fontScale, thickness)
    cv2.putText(identity_card, university_name_1, (origin_x - text_w, y),
                fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                fontScale=fontScale, color=(0, 0, 0),
                thickness=thickness, lineType=cv2.LINE_AA)

    y += y_step
    (text_w, _), _ = cv2.getTextSize(
        university_name_2, font, fontScale, thickness)
    cv2.putText(identity_card, university_name_2, (origin_x - text_w, y),
                fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                fontScale=fontScale, color=(0, 0, 0),
                thickness=thickness, lineType=cv2.LINE_AA)

    y += y_step
    (text_w, _), _ = cv2.getTextSize(
        university_name_3, font, fontScale, thickness)
    cv2.putText(identity_card, university_name_3, (origin_x - text_w, y),
                fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                fontScale=fontScale, color=(0, 0, 0),
                thickness=thickness, lineType=cv2.LINE_AA)


licence_template = cv2.imread("./wzor-els.png")
personal = pd.read_csv("./personal.csv", header=0, dtype="str")

font1 = cv2.FONT_HERSHEY_DUPLEX

for i in range(1, 11):
    licence = licence_template.copy()
    photo = cv2.imread(f"./faces/person{i:02}-3.png")
    person = personal.iloc[i-1]

    print_big_photo(licence, photo)

    print_watermark(licence)

    print_personal_information(licence, person)

    if not cv2.imwrite(f"./els/person{i:02}.jpg", licence):
        print("writing image failed (check directory existence)")
        break
