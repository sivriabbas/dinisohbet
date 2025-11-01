const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'DiniSohbet API',
            version: '1.0.0',
            description: 'DiniSohbet İslami Portal RESTful API Dokümantasyonu',
            contact: {
                name: 'DiniSohbet Support',
                email: 'support@dinisohbet.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:3002/api/v1',
                description: 'Development server'
            },
            {
                url: 'https://dinisohbet.com/api/v1',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                },
                apiKey: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'X-API-Key'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false
                        },
                        error: {
                            type: 'string',
                            example: 'Error message'
                        },
                        message: {
                            type: 'string',
                            example: 'Detailed error description'
                        }
                    }
                },
                Surah: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string'
                        },
                        number: {
                            type: 'number',
                            example: 1
                        },
                        name: {
                            type: 'string',
                            example: 'Fatiha'
                        },
                        nameArabic: {
                            type: 'string',
                            example: 'الفاتحة'
                        },
                        verseCount: {
                            type: 'number',
                            example: 7
                        },
                        revelationType: {
                            type: 'string',
                            enum: ['Mekki', 'Medeni']
                        }
                    }
                },
                Verse: {
                    type: 'object',
                    properties: {
                        number: {
                            type: 'number'
                        },
                        arabic: {
                            type: 'string'
                        },
                        turkish: {
                            type: 'string'
                        }
                    }
                },
                Hadith: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string'
                        },
                        source: {
                            type: 'string',
                            enum: ['Buhari', 'Muslim', 'EbuDavud', 'Tirmizi', 'Nesai', 'IbnMace']
                        },
                        number: {
                            type: 'number'
                        },
                        arabic: {
                            type: 'string'
                        },
                        turkish: {
                            type: 'string'
                        },
                        category: {
                            type: 'string'
                        }
                    }
                },
                Dua: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string'
                        },
                        title: {
                            type: 'string'
                        },
                        arabic: {
                            type: 'string'
                        },
                        turkish: {
                            type: 'string'
                        },
                        transliteration: {
                            type: 'string'
                        },
                        category: {
                            type: 'string'
                        }
                    }
                },
                Post: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string'
                        },
                        title: {
                            type: 'string'
                        },
                        content: {
                            type: 'string'
                        },
                        author: {
                            type: 'object'
                        },
                        category: {
                            type: 'string'
                        },
                        tags: {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        },
                        likes: {
                            type: 'number'
                        },
                        comments: {
                            type: 'number'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication endpoints'
            },
            {
                name: 'Quran',
                description: 'Quran surahs and verses'
            },
            {
                name: 'Hadiths',
                description: 'Hadith collections'
            },
            {
                name: 'Duas',
                description: 'Islamic prayers and supplications'
            },
            {
                name: 'Posts',
                description: 'Community forum posts'
            },
            {
                name: 'Users',
                description: 'User management'
            },
            {
                name: 'Search',
                description: 'Global search functionality'
            }
        ]
    },
    apis: ['./routes/api/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = {
    specs,
    swaggerUi
};
