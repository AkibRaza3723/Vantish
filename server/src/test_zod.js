import { completeProfileSchema } from './validators/user.validator.js';

const studentPayload = {
  role: 'student',
  username: 'test_student',
  bio: 'A student bio',
  organizations: 'Stanford University',
  organization_type: 'University',
  course: 'Computer Science',
  graduationYear: 2027
};

const employedPayload = {
  role: 'employed',
  username: 'test_employed',
  bio: 'An employed bio',
  organizations: 'Stripe',
  organization_type: 'Startup',
  course: 'Engineering',
  position: 'Software Engineer',
  Experience: 3
};

console.log('Testing Student Payload:');
const studentRes = completeProfileSchema.safeParse(studentPayload);
console.log('Success:', studentRes.success);
if (!studentRes.success) {
  console.log('Errors:', studentRes.error.flatten());
}

console.log('\nTesting Employed Payload:');
const employedRes = completeProfileSchema.safeParse(employedPayload);
console.log('Success:', employedRes.success);
if (!employedRes.success) {
  console.log('Errors:', employedRes.error.flatten());
}
