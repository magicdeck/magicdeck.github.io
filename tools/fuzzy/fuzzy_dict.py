import json
import re


class FuzzyDict(object):
    GUARD = '#'

    def __init__(self):
        self.key_value = {}
        self.big_key = FuzzyDict.GUARD

    def insert(self, key, sub, value):
        key = key.lower()
        sub = sub.lower()
        if key in self.key_value:
            self.key_value[key][sub] = value
        else:
            self.key_value[key] = {sub: value}
            self.big_key = self.big_key + key + FuzzyDict.GUARD

    def do_fuzzy_lookup(self, seed):
        seed = seed.lower()
        positions = [m.start() for m in re.finditer(seed, self.big_key)]
        if len(positions) == 0:
            return None
        index = positions[0]
        begin = index
        while self.big_key[begin] != FuzzyDict.GUARD:
            begin -= 1
        begin += 1
        end = index
        while self.big_key[end] != FuzzyDict.GUARD:
            end += 1
        return self.key_value[self.big_key[begin:end]]

    def lookup(self, seed, hint=None):
        seed = seed.lower()
        hint = hint.lower()
        if seed in self.key_value:
            sub_dict = self.key_value[seed]
        else:
            sub_dict = self.do_fuzzy_lookup(seed)
        if sub_dict is None:
            return None
        if hint not in sub_dict:
            return sub_dict[next(iter(sub_dict))]
        else:
            return sub_dict[hint]

    @classmethod
    def dump(cls, obj, fp):
        json.dump(obj.key_value, fp)

    @classmethod
    def load(cls, fp):
        obj = FuzzyDict()
        obj.key_value = json.load(fp)
        obj.big_key = FuzzyDict.GUARD + FuzzyDict.GUARD.join(list(obj.key_value.keys())) + FuzzyDict.GUARD
        return obj
