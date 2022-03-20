"""
La fonction recherche prend en paramètres deux chaines de caractères gene et  
seq_adn et renvoie True si on retrouve gene dans seq_adn et False sinon. 
Compléter le code Python ci-dessous pour qu’il implémente la fonction recherche.
"""

def recherche(gene, seq_adn):
    n = len(seq_adn)
    g = len(gene)
    i = 0
    trouve = False
    while i < n and not trouve:
        j = 0
        while j < g and gene[j] == seq_adn[i+j]:
            j+=1
        if j == g:
            trouve = True
        i+=1
    return trouve

print(recherche("AATC", "GTACAAATCTTGCC"))
print(recherche("AGTC", "GTACAAATCTTGCC"))

"""
Écrire une fonction maxi qui prend en paramètre une liste tab de nombres entiers et qui 
renvoie  un  couple  donnant  le  plus  grand  élément  de  cette  liste  ainsi  que  l’indice  de  la 
première apparition de ce maximum dans la liste. 
Exemple : 
>>> maxi([1,5,6,9,1,2,3,7,9,8]) 
(9,3)

def maxi(tab):
    maxi = (tab[0], 0)
    for i in range(len(tab)):
        if tab[i] > maxi[0]:
            maxi = (tab[i], i)
    return maxi
"""