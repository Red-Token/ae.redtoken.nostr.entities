import merge from 'deepmerge';

function replaceArrays(destinationArray: any, sourceArray: any, options: any): any[] {
    return sourceArray;
}

function deepMergeVariable<T extends AbstractNostrEntity<T>>(varName: keyof T, obj: T): any {
    return obj.inherits.map(id => obj.realm.get(id)).reduce((accumulated, parent) => {
        return merge(parent === undefined ? {} : deepMergeVariable(varName, parent), accumulated, {arrayMerge: replaceArrays});
    }, obj[varName])
}

export function getFirstVariable<T extends AbstractNostrEntity<T>>(varName: keyof T, obj: T): any {
    return obj[varName] !== undefined ? obj[varName] :
        obj.inherits.reverse().map(id => {
            const parent = obj.realm.get(id)
            return parent !== undefined ? getFirstVariable<T>(varName, parent) : undefined
        }).find(c => c !== undefined)
}


function cleanObject(obj: any): any {
    // If it's not an object or array, return it unchanged
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // If it's an array, clean each element in the array
    if (Array.isArray(obj)) {
        return obj
            .map(cleanObject)
            .filter(item => item !== null && item !== undefined); // Remove null or undefined elements
    }

    // For objects, iterate over each property
    for (const key in obj) {
        // Recurse if the property is an object or array, and delete if it's null or undefined
        if (obj.hasOwnProperty(key)) {
            obj[key] = cleanObject(obj[key]);

            if (obj[key] === null || obj[key] === undefined) {
                delete obj[key]; // Delete the property if it's null or undefined
            }
        }
    }

    return obj;
}


export function cleanDeepMergeVariable<T extends AbstractNostrEntity<T>>(varName: keyof T, obj: T): any {
    return cleanObject(deepMergeVariable(varName, obj))
}

export abstract class AbstractNostrEntity<T extends AbstractNostrEntity<T>> {
    readonly id: string
    readonly inherits: string[]
    readonly realm: Map<string, T>

    protected constructor(id: string, inherits: [], realm: Map<string, T>) {
        this.id = id;
        this.inherits = inherits !== undefined ? inherits : [];
        this.realm = realm
    }
}
