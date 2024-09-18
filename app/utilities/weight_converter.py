from typing import Union


def grams_to_pounds(weight: Union[float, int, str]) -> float:
    if isinstance(weight, int) or isinstance(weight, str):
        try:
            weight = float(weight)
        except ValueError:
            return 0.0
    return round((weight / 453.59237), 2)


def grams_to_kilograms(weight: Union[float, int, str]) -> float:
    if isinstance(weight, int) or isinstance(weight, str):
        try:
            weight = float(weight)
        except ValueError:
            return 0.0
    return round((weight / 1000), 2)


def pounds_to_grams(weight: Union[float, int, str]) -> float:
    if isinstance(weight, int) or isinstance(weight, str):
        try:
            weight = float(weight)
        except ValueError:
            return 0.0
    return round((weight * 453.59237), 2)


def kilograms_to_grams(weight: Union[float, int, str]) -> float:
    if isinstance(weight, int) or isinstance(weight, str):
        try:
            weight = float(weight)
        except ValueError:
            return 0.0
    return round((weight * 1000), 2)


if __name__ == "__main__":
    pounds_to_grams = pounds_to_grams(44.25)
    grams_to_pounds = grams_to_pounds(pounds_to_grams)
    kilograms_to_grams = kilograms_to_grams(25)
    grams_to_kilograms = grams_to_kilograms(pounds_to_grams)
    print("pounds_to_grams", pounds_to_grams, "g")
    print("grams_to_pounds", grams_to_pounds, "lbs")
    print("kilograms_to_grams", kilograms_to_grams, "g")
    print("grams_to_kilograms", grams_to_kilograms, "kg")
