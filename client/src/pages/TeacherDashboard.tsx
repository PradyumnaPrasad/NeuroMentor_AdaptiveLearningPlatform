import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, BookOpen, TrendingUp, Award, Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ThemeToggle from '@/components/ThemeToggle';

// Mock teacher data
const teacherData = {
  name: "Ms. Johnson",
  class: "Grade 4A",
  students: [
    { id: 1, name: "Alex Parker", avatar: "👦", completedTopics: 8, stars: 120, accuracy: 92, lastActive: "Today", status: "excellent" },
    { id: 2, name: "Emma Wilson", avatar: "👧", completedTopics: 7, stars: 105, accuracy: 88, lastActive: "Today", status: "good" },
    { id: 3, name: "Liam Chen", avatar: "👦", completedTopics: 6, stars: 90, accuracy: 85, lastActive: "Yesterday", status: "good" },
    { id: 4, name: "Sophia Rodriguez", avatar: "👧", completedTopics: 8, stars: 115, accuracy: 95, lastActive: "Today", status: "excellent" },
    { id: 5, name: "Noah Kim", avatar: "👦", completedTopics: 5, stars: 75, accuracy: 78, lastActive: "2 days ago", status: "average" },
    { id: 6, name: "Olivia Brown", avatar: "👧", completedTopics: 7, stars: 100, accuracy: 90, lastActive: "Today", status: "excellent" },
    { id: 7, name: "Ethan Davis", avatar: "👦", completedTopics: 4, stars: 60, accuracy: 72, lastActive: "3 days ago", status: "needs-help" },
    { id: 8, name: "Ava Martinez", avatar: "👧", completedTopics: 6, stars: 85, accuracy: 82, lastActive: "Yesterday", status: "good" },
  ],
  weeklyTopics: 24,
  totalQuizAttempts: 156,
};

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  const totalStudents = teacherData.students.length;
  const avgProgress = Math.round(
    teacherData.students.reduce((acc, s) => acc + s.completedTopics, 0) / totalStudents
  );
  const avgStars = Math.round(
    teacherData.students.reduce((acc, s) => acc + s.stars, 0) / totalStudents
  );

  const handleExport = (type: string) => {
    toast({
      title: `📊 Exporting ${type}...`,
      description: "This feature will be available soon!",
      duration: 3000,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'average': return 'bg-yellow-500';
      case 'needs-help': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent': return <Badge className="bg-green-500">Excellent</Badge>;
      case 'good': return <Badge className="bg-blue-500">Good</Badge>;
      case 'average': return <Badge className="bg-yellow-500">Average</Badge>;
      case 'needs-help': return <Badge className="bg-red-500">Needs Help</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pb-20">
      <ThemeToggle />
      
      <div className="container mx-auto px-4 pt-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <Button
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Student View
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={() => handleExport('CSV')}
                variant="outline"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
              <Button
                onClick={() => handleExport('Report')}
                variant="outline"
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                Generate Report
              </Button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border-2 border-primary/20">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Teacher Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Welcome, {teacherData.name} • {teacherData.class}
            </p>
          </div>
        </motion.div>

        {/* Overview Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-2 border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="w-5 h-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground mt-1">Active learners</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-600/10 border-2 border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgProgress} topics</div>
              <p className="text-xs text-muted-foreground mt-1">Per student</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-2 border-yellow-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Weekly Topics</CardTitle>
              <BookOpen className="w-5 h-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{teacherData.weeklyTopics}</div>
              <p className="text-xs text-muted-foreground mt-1">Completed this week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-2 border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Quiz Attempts</CardTitle>
              <Award className="w-5 h-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{teacherData.totalQuizAttempts}</div>
              <p className="text-xs text-muted-foreground mt-1">Total this month</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Class Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white dark:bg-slate-800 border-2 border-primary/20">
            <CardHeader>
              <CardTitle>Class Performance Overview</CardTitle>
              <CardDescription>Topics completed by each student</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teacherData.students.map((student, index) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center gap-4"
                  >
                    <div className="text-2xl">{student.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium truncate">{student.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {student.completedTopics}/8 topics
                        </span>
                      </div>
                      <div className="relative">
                        <Progress value={(student.completedTopics / 8) * 100} className="h-2" />
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(student.status)}`} />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Student Details Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white dark:bg-slate-800 border-2 border-primary/20">
            <CardHeader>
              <CardTitle>Student Details</CardTitle>
              <CardDescription>Detailed progress and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead className="text-center">Topics</TableHead>
                      <TableHead className="text-center">Stars</TableHead>
                      <TableHead className="text-center">Accuracy</TableHead>
                      <TableHead className="text-center">Last Active</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teacherData.students.map((student) => (
                      <TableRow
                        key={student.id}
                        className={`cursor-pointer transition-colors ${
                          selectedStudent === student.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedStudent(student.id)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{student.avatar}</div>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold">{student.completedTopics}/8</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <span className="text-yellow-500">⭐</span>
                            <span className="font-semibold">{student.stars}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-semibold ${
                            student.accuracy >= 90 ? 'text-green-500' :
                            student.accuracy >= 80 ? 'text-blue-500' :
                            student.accuracy >= 70 ? 'text-yellow-500' :
                            'text-red-500'
                          }`}>
                            {student.accuracy}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground">
                          {student.lastActive}
                        </TableCell>
                        <TableCell className="text-center">
                          {getStatusBadge(student.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {selectedStudent && (
                <div className="mt-4 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    💡 Click on a student row to view detailed analytics (Coming soon!)
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-2 border-primary/20">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                📊 Advanced analytics, individual student reports, and assignment creation coming soon!
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button onClick={() => handleExport('Student Reports')} variant="outline">
                  📄 Individual Reports
                </Button>
                <Button onClick={() => handleExport('Class Analytics')} variant="outline">
                  📈 Class Analytics
                </Button>
                <Button onClick={() => handleExport('Assignment')} variant="outline">
                  ✏️ Create Assignment
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
