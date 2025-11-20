import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkle, ListChecks } from '@phosphor-icons/react';
import { AIBadge } from '@/components/ai/AIBadge';
import { callAI } from '@/lib/ai';
import { toast } from 'sonner';
import { useSEO } from '@/hooks/useSEO'
import { getPageMetadata } from '@/lib/seo-metadata'

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

export default function AITaskBuilder() {
  // Set SEO metadata
  const metadata = getPageMetadata('ai-task-builder')
  useSEO(metadata)

  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleGenerateTasks = async () => {
    if (!goal.trim()) {
      toast.error('Please enter a goal to build a task list.');
      return;
    }

    setIsLoading(true);
    setTasks([]);

    const systemPrompt = `You are an expert project manager. Your goal is to break down a user's goal into a series of small, actionable steps.

User's Goal: "${goal}"

Generate a list of 5-10 specific tasks to achieve this goal. The tasks should be clear and concise.

Format your response as a JSON array of strings. For example: ["First task here", "Second task here", "Third task here"]. Do not include any other text or markdown formatting.`;

    try {
      const result = await callAI(systemPrompt, 'anthropic');
      const taskStrings: string[] = JSON.parse(result);
      const newTasks: Task[] = taskStrings.map((text, index) => ({
        id: index + 1,
        text,
        completed: false,
      }));
      setTasks(newTasks);
      toast.success('Task list generated!');
    } catch (error) {
      console.error('Task generation error:', error);
      toast.error('Failed to generate tasks. The AI might be busy, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-foreground tracking-tight">AI Task Builder</h1>
          <p className="text-lg text-muted-foreground mt-3">Turn any goal into a step-by-step plan with AI.</p>
          <AIBadge className="mt-2 inline-block" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListChecks size={24} />
              What is Your Goal?
            </CardTitle>
            <CardDescription>
              Describe what you want to accomplish, and the AI will create a plan for you.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="For example: 'Learn to play the guitar', 'Launch a new blog', 'Plan a week-long trip to Japan'..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={4}
              disabled={isLoading}
            />
            <Button onClick={handleGenerateTasks} disabled={isLoading || !goal.trim()} className="w-full gap-2">
              <Sparkle size={18} weight="fill" />
              {isLoading ? 'Building Plan...' : 'Build My Plan'}
            </Button>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="text-center mt-8">
             <div role="status">
              <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4 text-muted-foreground">AI is building your step-by-step plan...</p>
          </div>
        )}

        {tasks.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Your Action Plan</CardTitle>
              <CardDescription>Here are the steps to achieve your goal. Check them off as you go!</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent"
                  >
                    <div className={`w-5 h-5 rounded-sm flex items-center justify-center mr-4 flex-shrink-0 ${task.completed ? 'bg-primary' : 'border-2 border-primary'}`}>
                      {task.completed && <svg className="w-3 h-3 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                    </div>
                    <span className={`flex-grow ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {task.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
