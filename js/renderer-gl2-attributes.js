/**
 * A shared layout for vertex attributes. Not every shader has to implement 
 * these attribs, but any that it does have will be forced to use the same 
 * layout.
 */
export const vertexAttributeLayout = [
   {
    name: 'aPosition',
    size: 3,
    type: 'FLOAT',
    normalized: false,
  },
  {
    name: 'aNormal',
    size: 3,
    type: 'FLOAT',
    normalized: false,
  },
  {
    name: 'aTexCoord',
    size: 2,
    type: 'FLOAT',
    normalized: false,
  },
  {
    name: 'aColor',
    size: 4,
    type: 'FLOAT',
    normalized: false,
  },
  {
    name: 'aSurfaceId',
    size: 1,
    type: 'FLOAT',
    normalized: false,
  },
  {
    name: 'aRegister1',
    size: 4,
    type: 'FLOAT',
    normalized: false,
  },
  {
    name: 'aRegister2',
    size: 4,
    type: 'FLOAT',
    normalized: false,
  },
];