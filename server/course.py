import sys 
# Takes first name and last name via command  
# line arguments and then display them 
print("Output from Python") 
print("First name: " ) 
print("Last name: " ) 
course = {
    'name': '10th Grade Biology',
    'section': 'Period 2',
    'descriptionHeading': 'Welcome to 10th Grade Biology',
    'description': """We'll be learning about about the structure of living
                 creatures from a combination of textbooks, guest
                 lectures, and lab work. Expect to be excited!""",
    'room': '301',
    'ownerId': 'me',
    'courseState': 'PROVISIONED'
}
course = service.courses().create(body=course).execute()
print u'Course created: {0} ({1})'.format(course.get('name'),
    course.get('id'))