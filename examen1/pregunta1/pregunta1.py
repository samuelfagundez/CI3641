def potencia(a,b):
    return pow(a,b)

def producto_matrices(a, b):
    filas_a = len(a)
    filas_b = len(b)
    columnas_a = len(a[0])
    columnas_b = len(b[0])
    if columnas_a != filas_b:
        return None
    producto = []

    try:
        for i in range(filas_b):
            producto.append([])
            for j in range(columnas_b):
                producto[i].append(None)

        for c in range(columnas_b):
            for i in range(filas_a):
                suma = 0
                for j in range(columnas_a):
                    suma += a[i][j]*b[j][c]
                producto[i][c] = suma
        return producto
    except:
        print("Estas matrices no se pueden operar")
