const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const searchTerms = q.split(' ').filter(term => term.length > 0);
        
     
        const results = await req.db.collection('pdfs').aggregate([
            {
                $match: {
                    $text: {
                        $search: searchTerms.join(' '),
                        $caseSensitive: false,
                        $diacriticSensitive: false
                    }
                }
            },
            {
                $addFields: {
                    score: {
                        $add: [
                            { $meta: "textScore" },
                            {
                                $cond: {
                                    if: {
                                        $regexMatch: {
                                            input: { $ifNull: ["$metadata.file_name", ""] },
                                            regex: new RegExp(searchTerms.join('.*'), 'i')
                                        }
                                    },
                                    then: 10,
                                    else: 0
                                }
                            }
                        ]
                    },
                    highlight: {
                        content: {
                            $substr: [{ $ifNull: ["$content", ""] }, 0, 200]
                        }
                    }
                }
            },
            {
                $sort: { score: -1 }
            }
        ]).toArray();

        const hits = results.map(doc => ({
            _id: doc._id,
            _source: {
                content: doc.content,
                metadata: doc.metadata
            },
            highlight: {
                content: [doc.highlight.content + "..."]
            }
        }));

        res.json({ hits });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            error: 'Search failed',
            details: error.message 
        });
    }
});

module.exports = router;