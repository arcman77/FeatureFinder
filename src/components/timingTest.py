import time

def foo(b):
	pass


def iterate_slices(sz, a):
	for i in range(0, len(a) - sz):
		foo(a[i:sz+i])


start = time.time()
iterate_slices(list(range(0,50000000)))
end = time.time()

print('total: {}'.format(end - start))