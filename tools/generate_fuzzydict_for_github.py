import json
import os
import shutil

from fuzzy.fuzzy_dict import FuzzyDict


def list_set_files(path):
    return os.listdir(path)


if __name__ == '__main__':
    fd = FuzzyDict()
    path = f"../tools-input/"
    for file in list_set_files(path):
        if '.json' in file:
            with open(path + file, "r") as fp:
                set = json.load(fp)
                set_code = set['code'].upper()
                for card in set['cards']:
                    if 'multiverseId' in card:
                        for neglect in ['foreignData', 'legalities', 'prices', 'mcmId', 'mcmMetaId', 'mtgArenaId', 'mtgoId', 'mtgoFoilId', 'mtgstocksId', 'purchaseUrls', 'scryfallId', 'scryfallIllustrationId', 'scryfallOracleId', 'tcgplayerProductId', 'hasFoil', 'hasNonFoil', 'isArena', 'isMtgo', 'isPaper', 'printings', 'uuid', 'variations']:
                            card.pop(neglect, None)
                        card['set_code'] = set_code
                        fd.insert(card['name'], set_code, card)
                        # temporary solution - duplicate cards - support number within set
                        number = card['number']
                        card_code = f'{set_code}{number}'
                        fd.insert(card['name'], card_code, card)
    with open('fuzzydict.json', 'w') as fp:
        FuzzyDict.dump(fd, fp)
    shutil.move('fuzzydict.json', '../static/mtg-deck-viewer/')
