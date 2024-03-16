'use client';

import { addUser } from '@/lib/action';
// import styles from './adminUserForm.module.css';
import { useFormState } from 'react-dom';
import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SquarePen, AlertCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';

const AdminUserForm = () => {
    const [state, formAction] = useFormState(addUser, undefined);
    useEffect(() => {
        if (state && state.result?.acknowledged) {
            document.getElementById('userForm').reset();
            toast.success('Post added successfully');
        }
    }, [state]);
    return (
        <form action={formAction} id="userForm">
            <div className="flex flex-row">
                <SquarePen className="mr-4" />{' '}
                <h1 className="mb-4 text-xl font-medium leading-none">
                    Admin User Form
                </h1>
            </div>
            <Input type="text" name="username" placeholder="Username" />
            <Input type="email" name="email" placeholder="Email" />
            <Input type="password" name="password" placeholder="Password" />
            <Input type="text" name="image" placeholder="Image" />
            <RadioGroup defaultValue="false" name="isAdmin">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="r1" />
                    <Label htmlFor="r1">Default user</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="r2" />
                    <Label htmlFor="r2">Admin</Label>
                </div>
            </RadioGroup>
            <Button
                type="submit"
                className="p-[20px] bg-[#3280f6] text-white hover:bg-[#2769b8]"
                disabled={state?.loading}
            >
                Submit
            </Button>
            {state?.error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}
        </form>
    );
};

export default AdminUserForm;
