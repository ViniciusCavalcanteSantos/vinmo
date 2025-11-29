import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';

export async function GET(request: Request) {
  const cookieStore = await cookies();

  cookieStore.delete('logged_in');

  redirect('/signin');
}