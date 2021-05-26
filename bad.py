def add(a: int, b: int) -> int:
    # return '' # this is fine apparently
    return a + b

print(add(1, 2)) # 3
print(add('1', '2')) # '12'
print(add('1', 2)) # error
print(add(1)) # error