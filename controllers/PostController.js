import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate({
            path: 'user',
            select:['fullName','avatarUrl'],
        });

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статью',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        // Используем async/await вместо колбэка
        const updatedPost = await PostModel.findOneAndUpdate(
            { _id: postId },  // Условие поиска
            { $inc: { viewsCount: 1 } },  // Обновление поля viewsCount
            { new: true }  // Возвращаем обновленный документ
        );

        if (!updatedPost) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json(updatedPost);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статью',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const deletedPost = await PostModel.findOneAndDelete({ _id: postId });

        if (!deletedPost) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить статью',
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.title,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью',
        });
    } 
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        // Обновление статьи с использованием findOneAndUpdate для получения обновленного документа
        const updatedPost = await PostModel.findOneAndUpdate(
            { _id: postId },  // Условие поиска
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                user: req.userId,
                tags: req.body.tags,
            },
            { new: true } // Параметр для возвращения обновленного документа
        );

        // Проверка, если пост не найден
        if (!updatedPost) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        // Отправка успешного ответа с обновленным постом
        res.json({
            success: true,
            post: updatedPost,  // Возвращаем обновленный пост
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
};
