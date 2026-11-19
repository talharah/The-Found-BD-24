import { Router } from 'express';
import db, { randomUUID } from '../db.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

function toPublicTask(t) {
  return {
    id: t.id,
    title: t.title,
    reward: t.reward,
    type: t.type,
    link: t.link,
    instructions: t.instructions,
    durationSeconds: t.duration_seconds,
  };
}

router.get('/', (req, res) => {
  res.json(db.prepare('SELECT * FROM tasks').all().map(toPublicTask));
});

// Admin: create or update a task
router.post('/', requireAuth, requireAdmin, (req, res) => {
  const { id, title, reward, type, link, instructions, durationSeconds } = req.body;
  const taskId = id || `task-${randomUUID()}`;
  const existing = db.prepare('SELECT id FROM tasks WHERE id = ?').get(taskId);

  if (existing) {
    db.prepare(`
      UPDATE tasks SET title=?, reward=?, type=?, link=?, instructions=?, duration_seconds=?
      WHERE id=?
    `).run(title, reward, type, link, instructions, durationSeconds || 10, taskId);
  } else {
    db.prepare(`
      INSERT INTO tasks (id, title, reward, type, link, instructions, duration_seconds)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(taskId, title, reward, type, link, instructions, durationSeconds || 10);
  }

  const saved = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  res.status(201).json(toPublicTask(saved));
});

router.delete('/:id', requireAuth, requireAdmin, (req, res) => {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.json({ message: 'টাস্ক ডিলিট করা হয়েছে।' });
});

router.post('/:id/complete', requireAuth, (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  if (!task) return res.status(404).json({ error: 'টাস্ক পাওয়া যায়নি।' });

  const already = db.prepare('SELECT id FROM completed_tasks WHERE user_id = ? AND task_id = ?')
    .get(req.user.id, task.id);
  if (already) {
    return res.status(400).json({ error: 'এই টাস্ক আগেই সম্পন্ন করা হয়েছে।' });
  }

  const tx = db.transaction(() => {
    db.prepare(`
      INSERT INTO completed_tasks (id, user_id, task_id, completed_at, reward)
      VALUES (?, ?, ?, ?, ?)
    `).run(`ct-${randomUUID()}`, req.user.id, task.id, new Date().toISOString(), task.reward);
    db.prepare('UPDATE users SET balance = balance + ?, total_earned = total_earned + ? WHERE id = ?')
      .run(task.reward, task.reward, req.user.id);
  });
  tx();

  res.json({ message: 'টাস্ক সম্পন্ন হয়েছে, পুরস্কার যোগ হয়েছে।', reward: task.reward });
});

export default router;
