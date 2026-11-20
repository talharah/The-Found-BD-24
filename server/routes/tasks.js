import { Router } from 'express';
import { pool, randomUUID, withTransaction } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

function toPublicTask(t) {
  return {
    id: t.id,
    title: t.title,
    reward: Number(t.reward),
    type: t.type,
    link: t.link,
    instructions: t.instructions,
    durationSeconds: t.duration_seconds,
  };
}

router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM tasks');
  res.json(rows.map(toPublicTask));
});

// Admin: create or update a task
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { id, title, reward, type, link, instructions, durationSeconds } = req.body;
  const taskId = id || `task-${randomUUID()}`;
  const { rows: existingRows } = await pool.query('SELECT id FROM tasks WHERE id = $1', [taskId]);

  if (existingRows.length > 0) {
    await pool.query(
      `UPDATE tasks SET title=$1, reward=$2, type=$3, link=$4, instructions=$5, duration_seconds=$6 WHERE id=$7`,
      [title, reward, type, link, instructions, durationSeconds || 10, taskId]
    );
  } else {
    await pool.query(
      `INSERT INTO tasks (id, title, reward, type, link, instructions, duration_seconds)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [taskId, title, reward, type, link, instructions, durationSeconds || 10]
    );
  }

  const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [taskId]);
  res.status(201).json(toPublicTask(rows[0]));
});

router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
  res.json({ message: 'টাস্ক ডিলিট করা হয়েছে।' });
});

router.post('/:id/complete', requireAuth, async (req, res) => {
  try {
    const { rows: taskRows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    const task = taskRows[0];
    if (!task) return res.status(404).json({ error: 'টাস্ক পাওয়া যায়নি।' });

    const { rows: alreadyRows } = await pool.query(
      'SELECT id FROM completed_tasks WHERE user_id = $1 AND task_id = $2',
      [req.user.id, task.id]
    );
    if (alreadyRows.length > 0) {
      return res.status(400).json({ error: 'এই টাস্ক আগেই সম্পন্ন করা হয়েছে।' });
    }

    await withTransaction(async (client) => {
      await client.query(
        `INSERT INTO completed_tasks (id, user_id, task_id, completed_at, reward)
         VALUES ($1, $2, $3, $4, $5)`,
        [`ct-${randomUUID()}`, req.user.id, task.id, new Date().toISOString(), task.reward]
      );
      await client.query(
        'UPDATE users SET balance = balance + $1, total_earned = total_earned + $1 WHERE id = $2',
        [task.reward, req.user.id]
      );
    });

    res.json({ message: 'টাস্ক সম্পন্ন হয়েছে, পুরস্কার যোগ হয়েছে।', reward: Number(task.reward) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'সার্ভারে একটি সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।' });
  }
});

export default router;
