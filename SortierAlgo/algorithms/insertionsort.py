def sort(array):
    steps = 0
    for i in range(2, len(array)):
        val = array[i]
        j = i
        while j > 1 and array[j-1] > val:
            array[j] = array[j - 1]
            steps += 1
            j -= 1
        array[j] = val
        steps += 1
    return steps