class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

steps = 0

def storeSorted(root, array):
    global steps
    if root != None:
        storeSorted(root.left, array)
        array.append(root.value)
        steps += 1
        storeSorted(root.right, array)

def insert(node, val):
    global steps
    if node is None:
        steps += 1
        return Node(val)

    if val < node.value:
        node.left = insert(node.left, val)
        steps += 1
    elif val > node.value:
        node.right = insert(node.right, val)
        steps += 1
    return node

def sort(array):
    global steps
    steps = 0
    
    
    root = None
    root = insert(root, array[0])
    for i in range(len(array)):
        insert(root, array[i])
        steps += 1

    res = []
    storeSorted(root, res)

    return steps