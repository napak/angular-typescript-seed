﻿
// #region [Interfaces]

/** Interface para declarar un modelo de definicion de ruta de estados personalizado (usando angular-ui-router)*/
interface IStateDefinition extends ng.ui.IState
{
    /** Flag indicando si la ruta requiere estar autenticado */
    requireAuth: boolean;
}

/** Interface para definir un objeto con un vector */
interface IVector
{
    X: number;
    Y: number;
}

/** Interface para definir un rectangulo en coordenadas de un sistema de ventanas:
 * El valor minimo esta arriba a la izquierda y el valor maximo abajo a la derecha 
 */
interface IRect
{
    /** Vector con el vertice menor del rectangulo (abajo derecha) */
    Min: IVector;
    /** Vector con el vertice mayor del rectangulo (arriba izquierda)*/
    Max: IVector;
}

// #endregion [Interfaces]


// #region [Enumeraciones]

/** Enumeracion con los posibles limites de un vector */
enum enumLimits
{
    MIN,
    MAX
} 

// #endregion [Enumeraciones]


// #region [Interfaces extension]

/** Interface para extender metodos de un objeto 'string' */
interface String
{
    /** Metodo extensor para separar una cadena en un array del mismo modo que string.split(), pero permitiendo eliminar items del array 
     * que coincidan con la cadena especificada por el parametro 'removeItemString'.
     * @param separator separador de la cadena que sera usado para crear el array
     * @param removeItemString cadena que sera usada para eliminar items en el array ej: "" -> elimina items vacios
     * @param limit taaño del limite del array que sera creado mediante la separacion de la cadena
     * @return array de cadenas que han sido separados por el delimitador
     */
    splitWithRemove(separator: string | RegExp, removeItemString: string, limit?: number): string[];
}

// #endregion [Interfaces extension]