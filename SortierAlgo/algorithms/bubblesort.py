def sort(array):
    steps = 0
    n = len(array)
    while True:
        newn = 1

        for i in range(n-1):
            if array[i] > array[i+1]:
                array[i], array[i+1] = array[i+1], array[i]
                steps += 1
                newn = i+1
        n = newn
        if n <= 1:
            break
    return steps