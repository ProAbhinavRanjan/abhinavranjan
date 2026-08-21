import os
import re

def update_handles():
    root_dir = r"c:\Users\DeveloperAbhinav\Downloads\abhinavranjan-main (1)\abhinavranjan-main"
    
    # Target replacements
    # 1. @i_abhinavranjanan -> @arabhinavranjan
    # 2. @i_abhinavranjan -> @arabhinavranjan
    # 3. twitter.com/i_abhinavranjan -> twitter.com/arabhinavranjan
    
    extensions = ('.html', '.js', '.json', '.txt', '.xml')
    
    for dirpath, _, filenames in os.walk(root_dir):
        # Skip node_modules or .git if any
        if 'node_modules' in dirpath or '.git' in dirpath or '.gemini' in dirpath:
            continue
            
        for file in filenames:
            if file.endswith(extensions):
                filepath = os.path.join(dirpath, file)
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    original = content
                    
                    # Replacements
                    content = content.replace('@i_abhinavranjanan', '@arabhinavranjan')
                    content = content.replace('@i_abhinavranjan', '@arabhinavranjan')
                    content = content.replace('twitter.com/i_abhinavranjan', 'twitter.com/arabhinavranjan')
                    content = content.replace('twitter.com/ar-abhinavranjan', 'twitter.com/arabhinavranjan')
                    
                    if content != original:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"Updated: {filepath}")
                except Exception as e:
                    print(f"Failed to process {filepath}: {e}")

if __name__ == '__main__':
    update_handles()
