const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Template = require('../models/Template');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/templates';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.pdf', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and Word documents are allowed.'));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Get all templates (public ones for non-authenticated users)
router.get('/', async (req, res) => {
    try {
        const query = req.user ? {} : { isPublic: true };
        const templates = await Template.find(query)
            .select('-filePath')
            .sort('-createdAt');
        res.json(templates);
    } catch (error) {
        console.error('Error fetching templates:', error);
        res.status(500).json({ message: 'Error fetching templates' });
    }
});

// Get template by category
router.get('/category/:category', async (req, res) => {
    try {
        const query = {
            category: req.params.category,
            ...(req.user ? {} : { isPublic: true })
        };
        const templates = await Template.find(query)
            .select('-filePath')
            .sort('-createdAt');
        res.json(templates);
    } catch (error) {
        console.error('Error fetching templates by category:', error);
        res.status(500).json({ message: 'Error fetching templates' });
    }
});

// Upload new template (admin only)
router.post('/', [auth, admin, upload.single('file')], async (req, res) => {
    try {
        const { title, description, category, isPublic } = req.body;

        const template = new Template({
            title,
            description,
            category,
            isPublic: isPublic === 'true',
            filePath: req.file.path,
            fileType: path.extname(req.file.originalname).substring(1)
        });

        await template.save();
        res.status(201).json(template);
    } catch (error) {
        console.error('Error uploading template:', error);
        res.status(500).json({ message: 'Error uploading template' });
    }
});

// Download template (authenticated users only)
router.get('/download/:id', auth, async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        // Update download count
        template.downloadCount += 1;
        await template.save();

        // Add to user's downloaded templates if not already present
        if (!req.user.downloadedTemplates.includes(template._id)) {
            req.user.downloadedTemplates.push(template._id);
            await req.user.save();
        }

        res.download(template.filePath);
    } catch (error) {
        console.error('Error downloading template:', error);
        res.status(500).json({ message: 'Error downloading template' });
    }
});

// Update template (admin only)
router.put('/:id', [auth, admin], async (req, res) => {
    try {
        const template = await Template.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }
        res.json(template);
    } catch (error) {
        console.error('Error updating template:', error);
        res.status(500).json({ message: 'Error updating template' });
    }
});

// Delete template (admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const template = await Template.findById(req.params.id);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        // Delete file from storage
        fs.unlink(template.filePath, async (err) => {
            if (err) {
                console.error('Error deleting template file:', err);
            }
            await template.remove();
            res.json({ message: 'Template deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting template:', error);
        res.status(500).json({ message: 'Error deleting template' });
    }
});

module.exports = router;
