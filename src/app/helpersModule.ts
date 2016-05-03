﻿import angular = require("angular");
"use strict";

/** @Brief Clase para definir funciones de ayuda comunes para usar en la aplicacion
*/
class Helpers
{
    /** Funcion de ayuda para separar un array/cadena en partes de un tamaño especificado 
     * @param _input Array de elementos o una cadena para separar en partes
     * @param _chunks tamaño de las partes en las que sera separado el array/cadena
     * @return matriz conteniendo las partes de la separacion en partes, null en caso de no poder realizarse.
     */
    static SplitArray<T>(_input: T[] | string, _chunks: number = 1) : any[]
    {
        // verificar que es un array
        if (!angular.isArray(_input) && !angular.isString(_input)) return null;

        // crear el array para el resultado y recorrer el array/cadena de entrada para partirlo
        var result = [];
        for (var i = 0; i < _input.length; i += _chunks) result.push(_input.slice(i, i + _chunks));

        return result;
    }
}

/** Metodo extensor para separar una cadena en un array del mismo modo que string.split(), pero permitiendo eliminar items del array 
* que coincidan con la cadena especificada por el parametro 'removeItemString'.
* @param separator separador de la cadena que sera usado para crear el array
* @param removeItemString cadena que sera usada para eliminar items en el array ej: "" -> elimina items vacios
* @param limit taaño del limite del array que sera creado mediante la separacion de la cadena
* @return array de cadenas que han sido separados por el delimitador
*/
String.prototype.splitWithRemove = function (separator: string | RegExp, removeItemString: string, limit?: number): string[]
{
    if ("" == this) return new Array();

    var items = this.split(separator, limit);

    for (var i = 0; i < items.length; i++)
    {
        if (items[i] == removeItemString)
        {
            items.splice(i, 1);
            i--;
        }
    }
    return items;
}


export = Helpers;