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


def scale_and_crop_photo(photo, new_shape):
    photo_h, photo_w = photo.shape[:2]
    new_w, new_h  = new_shape
    scaled_w = int(photo_w * new_h / photo_h)
    dim = (new_h, scaled_w)

    scaled = cv2.resize(photo, dim, interpolation=cv2.INTER_AREA)
    offset_l = (scaled_w - new_w) // 2
    offset_r = scaled_w-new_w-offset_l

    return scaled[:, offset_l:scaled_w-offset_r]

def print_big_photo(licence, photo):
    dim = (200, 250)
    x, y = 30, 150
    w, h = dim

    roi = licence[y:y+h, x:x+w]
    photo = scale_and_crop_photo(photo, dim)

    mask = create_mask(dim, offset=15, max=230)
    photo = photo * mask + roi * (1-mask)

    licence[y:y+h, x:x+w] = photo


def print_small_photo(licence, photo):
    dim = (110, 120)
    x, y = 545, 250

    w, h = dim

    roi = licence[y:y+h, x:x+w]
    photo = scale_and_crop_photo(photo, dim)

    mask = create_mask(dim, offset=6, max=150)
    photo = photo * mask + roi * (1-mask)

    licence[y:y+h, x:x+w] = photo


def print_personal_information(identity_card, person: pd.Series):

    lastname = person["LastName"]
    firstname = person["FirstName"]
    nationality = "POLSKIE"
    birthdate = person["DateOfBirth"]
    sex = person["Sex"]
    pesel = person["PESEL"]
    validity_date = person["IdentityValidityDate"]
    can = person["CAN"]

    # last name
    x, y = 255, 135
    cv2.putText(identity_card, lastname.upper(), org=(x, y), 
                fontFace=cv2.FONT_HERSHEY_DUPLEX,
                fontScale=0.7, color=(0, 0, 0),
                thickness=2, lineType=cv2.LINE_AA)

    # first name
    x, y = 255, 187
    cv2.putText(identity_card, firstname.upper(), org=(x, y), 
                fontFace=cv2.FONT_HERSHEY_DUPLEX,
                fontScale=0.7, color=(0, 0, 0),
                thickness=2, lineType=cv2.LINE_AA)

    # nationality
    x, y = 255, 238
    cv2.putText(identity_card, nationality, org=(x, y), 
                fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                fontScale=0.7, color=(0, 0, 0),
                thickness=1, lineType=cv2.LINE_AA)

    # Date of birth
    x, y = 490, 235
    cv2.putText(identity_card, birthdate, org=(x, y), 
                fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                fontScale=0.5, color=(0, 0, 0),
                thickness=2, lineType=cv2.LINE_AA)

    # Sex
    x, y = 490, 295
    cv2.putText(identity_card, sex, (x, y),
                fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                fontScale=0.5, color=(0, 0, 0),
                thickness=2, lineType=cv2.LINE_AA)
    
    # PESEL
    x, y = 255, 298
    cv2.putText(identity_card, pesel, (x, y),
                fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                fontScale=0.7, color=(0, 0, 0),
                thickness=1, lineType=cv2.LINE_AA)
    
    # Validity date
    x, y = 255, 344
    cv2.putText(identity_card, validity_date, (x, y),
                fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                fontScale=0.7, color=(0, 0, 0),
                thickness=1, lineType=cv2.LINE_AA)

    # CAN
    x, y = 555, 400
    cv2.putText(identity_card, can, (x, y),
                fontFace=cv2.FONT_HERSHEY_SIMPLEX,
                fontScale=0.7, color=(0, 0, 0),
                thickness=1, lineType=cv2.LINE_AA)
    
    # Signature
    x, y = 255, 400
    cv2.putText(identity_card, f"{firstname} {lastname}", (x, y),
                fontFace=cv2.FONT_HERSHEY_SCRIPT_SIMPLEX,
                fontScale=1, color=(0, 0, 0),
                thickness=1, lineType=cv2.LINE_AA)


licence_template = cv2.imread("./wzor-dowod.jpg")
personal = pd.read_csv("./personal.csv", header=0, dtype="str")

font1 = cv2.FONT_HERSHEY_DUPLEX

for i in range(1, 11):
    licence = licence_template.copy()
    photo = cv2.imread(f"./faces/person{i:02}-2.png")
    person = personal.iloc[i-1]

    print_big_photo(licence, photo)
    print_small_photo(licence, photo)

    print_watermark(licence)

    print_personal_information(licence, person)

    if not cv2.imwrite(f"./identity-card/person{i:02}.jpg", licence):
        print("writing image failed (check directory existence)")
        break
