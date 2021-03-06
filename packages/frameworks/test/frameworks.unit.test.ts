import Ajv from 'ajv';
import path from 'path';
import { existsSync } from 'fs';
import { Framework } from '../';

function isString(arg: any): arg is string {
  return typeof arg === 'string';
}

const SchemaFrameworkDetectionItem = {
  type: 'array',
  items: [
    {
      type: 'object',
      required: ['path'],
      additionalProperties: false,
      properties: {
        path: {
          type: 'string',
        },
        matchContent: {
          type: 'string',
        },
      },
    },
  ],
};

const SchemaSettings = {
  oneOf: [
    {
      type: 'object',
      required: ['value'],
      additionalProperties: false,
      properties: {
        value: {
          type: 'string',
        },
      },
    },
    {
      type: 'object',
      required: ['placeholder'],
      additionalProperties: false,
      properties: {
        placeholder: {
          type: 'string',
        },
      },
    },
  ],
};

const Schema = {
  type: 'array',
  items: {
    type: 'object',
    required: ['name', 'slug', 'logo', 'description', 'settings'],
    additionalProperties: false,
    properties: {
      name: { type: 'string' },
      slug: { type: ['string', 'null'] },
      logo: { type: 'string' },
      demo: { type: 'string' },
      tagline: { type: 'string' },
      website: { type: 'string' },
      description: { type: 'string' },
      detectors: {
        type: 'object',
        additionalProperties: false,
        properties: {
          every: SchemaFrameworkDetectionItem,
          some: SchemaFrameworkDetectionItem,
        },
      },
      settings: {
        type: 'object',
        required: ['buildCommand', 'devCommand', 'outputDirectory'],
        additionalProperties: false,
        properties: {
          buildCommand: SchemaSettings,
          devCommand: SchemaSettings,
          outputDirectory: SchemaSettings,
        },
      },
    },
  },
};

describe('frameworks', () => {
  it('ensure there is an example for every framework', async () => {
    const root = path.join(__dirname, '..', '..', '..');
    const getExample = (name: string) => path.join(root, 'examples', name);

    const frameworks = require('../frameworks.json') as Framework[];

    const result = frameworks
      .map(f => f.slug)
      .filter(isString)
      .filter(f => existsSync(getExample(f)) === false);

    expect(result).toEqual([]);
  });

  it('ensure schema', async () => {
    const frameworks = require('../frameworks.json') as Framework[];

    const ajv = new Ajv();
    const result = ajv.validate(Schema, frameworks);

    if (ajv.errors) {
      console.error(ajv.errors);
    }

    expect(result).toBe(true);
  });
});
