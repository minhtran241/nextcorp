'use client';

import { addUser } from '@/lib/action';
import styles from './adminUserForm.module.css';
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
        // Show error message by toast
        // else if (state && state.error) {
        //     toast.error(state.error);
        // }
    }, [state]);
    return (
        <form action={formAction} className={styles.container} id="userForm">
            <div className="flex flex-row">
                <SquarePen className="mr-4" />{' '}
                <h1 className="mb-4 text-xl font-medium leading-none">
                    Admin User Form
                </h1>
            </div>
            {/* <input type="text" name="username" placeholder="Username" /> */}
            <Input type="text" name="username" placeholder="Username" />
            {/* <input type="email" name="email" placeholder="Email" /> */}
            <Input type="email" name="email" placeholder="Email" />
            {/* <input type="password" name="password" placeholder="Password" /> */}
            <Input type="password" name="password" placeholder="Password" />
            {/* <input type="text" name="image" placeholder="Image" /> */}
            <Input type="text" name="image" placeholder="Image" />
            {/* <select name="isAdmin">
                <option value="false">Is admin?</option>
                <option value="false">No</option>
                <option value="true">Yes</option>
            </select> */}
            {/* <Select name="isAdmin">
                <SelectTrigger>
                    <SelectValue placeholder="Is admin?" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Is admin?</SelectLabel>
                        <SelectItem value="false">No</SelectItem>inU
                        <SelectItem value="true">Yes</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select> */}
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
            {/* <button type="submit">Submit</button> */}
            <Button
                type="submit"
                className="p-[20px] bg-[#0033A0] text-white hover:bg-blue-800"
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
