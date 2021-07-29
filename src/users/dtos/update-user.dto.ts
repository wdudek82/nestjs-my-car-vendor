import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(15)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'password too weak',
  // })
  @IsOptional()
  password: string;

  // @IsString()
  // @MinLength(5)
  // @MaxLength(15)
  // @Match('password')
  // passwordConfirm: string;
}

// export function Match(property: string, validationOptions?: ValidationOptions) {
//   return (object: any, propertyName: string) => {
//     registerDecorator({
//       target: object.constructor,
//       propertyName,
//       options: validationOptions,
//       constraints: [property],
//       validator: MatchConstraint,
//     });
//   };
// }
//
// @ValidatorConstraint({ name: 'Match' })
// export class MatchConstraint implements ValidatorConstraintInterface {
//   validate(value: any, args: ValidationArguments) {
//     const [relatedPropertyName] = args.constraints;
//     const relatedValue = (args.object as any)[relatedPropertyName];
//     return value === relatedValue;
//   }
// }
