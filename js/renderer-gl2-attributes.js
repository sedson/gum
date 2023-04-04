/**
 * A shared layout for vertex attributes. Not every shader has to implement 
 * these attribs, but any that it does have will be forced to use the same 
 * layout.
 */
export const vertexAttributeLayout = {
  
  'aPosition': {
    index: 0,
    size: 3,
    type: 'FLOAT',
    normalized: false,
  },

  'aNormal': {
    index: 1,
    size: 3,
    type: 'FLOAT',
    normalized: false,
  },

  'aTexCoord': {
    index: 2,
    size: 2,
    type: 'FLOAT',
    normalized: false,
  },
  
  'aColor': {
    index: 3,
    size: 4,
    type: 'FLOAT',
    normalized: false,
  },

  'aSurfaceId': {
    index: 4,
    size: 1,
    type: 'FLOAT',
    normalized: false,
  },

  'aRegister1': {
    index: 5, 
    size: 4,
    type: 'FLOAT',
    normalized: false,
  },

  'aRegister2': {
    index: 6,
    size: 4,
    type: 'FLOAT',
    normalized: false,
  },
};